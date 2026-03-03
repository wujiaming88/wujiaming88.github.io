---
layout: post
title: "OpenClaw环境变量加载和使用机制研究"
date: 2026-03-03 04:21:00 +0000
categories: OpenClaw 技术研究
---

# OpenClaw环境变量加载和使用机制研究报告

## 一、核心机制概述

OpenClaw提供了完善的环境变量加载和管理机制，主要用于安全地处理API密钥等敏感信息。其核心设计理念是：
- **配置优先，环境变量兜底**：优先使用配置文件中的设置，环境变量作为备选方案
- **类型安全的秘密引用**：支持通过SecretRef对象引用环境变量、文件或执行命令获取的秘密
- **自动注入机制**：技能可以自动从环境变量加载配置的API密钥
- **安全沙箱隔离**：对环境变量进行 sanitize 处理，防止注入攻击

## 二、环境变量读取的三种方式

### 1. 直接读取（简单场景）
```typescript
// 直接读取环境变量
const apiKey = process.env.MY_SKILL_API_KEY;
```

**适用场景**：快速原型开发、简单技能
**示例**：web-search.ts中直接读取BRAVE_API_KEY

### 2. 使用normalizeResolvedSecretInputString（推荐方式）
```typescript
import { normalizeResolvedSecretInputString } from "../config/types.secrets.js";

// 从配置或环境变量读取API密钥
const apiKey = normalizeResolvedSecretInputString({
  value: config.apiKey, // 配置文件中的值
  path: "skills.entries.my-skill.apiKey", // 配置路径，用于错误提示
});
```

**适用场景**：正式技能开发，支持配置文件和环境变量两种方式
**示例**：tts.ts中读取ElevenLabs和OpenAI的API密钥

### 3. 使用SecretRef对象（高级场景）
```typescript
// 在配置文件中定义SecretRef
{
  "apiKey": {
    "source": "env",
    "provider": "default",
    "id": "MY_SKILL_API_KEY"
  }
}

// 在代码中解析
const { ref } = resolveSecretInputRef({
  value: config.apiKey,
  defaults: config.secrets?.defaults,
});
```

**适用场景**：需要动态切换秘密来源的复杂场景
**示例**：secrets/command-config.ts中的秘密解析逻辑

## 三、技能中读取API密钥的最佳实践

### 1. 配置文件优先，环境变量兜底
```typescript
import { normalizeResolvedSecretInputString } from "../config/types.secrets.js";
import { normalizeSecretInput } from "../utils/normalize-secret-input.js";

function resolveMySkillApiKey(config?: MySkillConfig): string | undefined {
  // 优先使用配置文件中的值
  const fromConfig = normalizeResolvedSecretInputString({
    value: config?.apiKey,
    path: "skills.entries.my-skill.apiKey",
  });
  
  // 环境变量作为备选
  const fromEnv = normalizeSecretInput(process.env.MY_SKILL_API_KEY);
  
  return fromConfig || fromEnv;
}
```

### 2. 在技能元数据中声明依赖
```typescript
// 在SKILL.md或技能配置中声明所需环境变量
{
  "metadata": {
    "primaryEnv": "MY_SKILL_API_KEY",
    "requires": {
      "env": ["MY_SKILL_API_KEY"]
    }
  }
}
```

### 3. 使用applySkillEnvOverrides自动注入
```typescript
import { applySkillEnvOverrides } from "../agents/skills/env-overrides.js";

// 自动将技能配置中的环境变量注入到process.env
const revert = applySkillEnvOverrides({
  skills: [mySkillEntry],
  config: openClawConfig,
});

// 使用后清理
revert();
```

## 四、环境变量的安全机制

### 1. 敏感信息过滤
- 自动过滤包含null字节的环境变量值
- 对危险的环境变量名称进行拦截（如OPENSSL_CONF）
- 支持环境变量白名单机制

### 2. 沙箱隔离
```typescript
import { sanitizeEnvVars } from "../agents/sandbox/sanitize-env-vars.js";

// 清理环境变量，只保留允许的变量
const sanitizedEnv = sanitizeEnvVars(process.env, {
  allowlist: ["MY_SKILL_API_KEY", "NODE_ENV"],
});
```

### 3. 秘密解析验证
```typescript
import { assertSecretInputResolved } from "../config/types.secrets.js";

// 验证秘密是否已解析
assertSecretInputResolved({
  value: config.apiKey,
  path: "skills.entries.my-skill.apiKey",
});
```

## 五、完整示例：开发一个使用环境变量的技能

### 1. 技能配置文件
```json
{
  "name": "my-skill",
  "version": "1.0.0",
  "description": "使用环境变量API密钥的示例技能",
  "metadata": {
    "primaryEnv": "MY_SKILL_API_KEY",
    "requires": {
      "env": ["MY_SKILL_API_KEY"]
    }
  },
  "config": {
    "apiKey": "${MY_SKILL_API_KEY}", // 环境变量引用模板
    "endpoint": "https://api.example.com/v1"
  }
}
```

### 2. 技能实现代码
```typescript
import { Type } from "@sinclair/typebox";
import { normalizeResolvedSecretInputString } from "../config/types.secrets.js";
import type { AnyAgentTool } from "./common.js";
import { jsonResult, readStringParam } from "./common.js";

const MySkillSchema = Type.Object({
  query: Type.String({ description: "查询字符串" }),
});

export function createMySkillTool(config?: OpenClawConfig): AnyAgentTool | null {
  const skillConfig = config?.skills?.entries?.["my-skill"];
  if (!skillConfig) return null;

  // 解析API密钥
  const apiKey = normalizeResolvedSecretInputString({
    value: skillConfig.config?.apiKey,
    path: "skills.entries.my-skill.config.apiKey",
  });

  if (!apiKey) {
    console.error("MY_SKILL_API_KEY环境变量未设置");
    return null;
  }

  return {
    label: "我的技能",
    name: "my_skill",
    description: "使用环境变量API密钥的示例技能",
    parameters: MySkillSchema,
    execute: async (_toolCallId, args) => {
      const query = readStringParam(args, "query", { required: true });

      // 使用API密钥调用外部服务
      const response = await fetch(`${skillConfig.config?.endpoint}/search`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      return jsonResult(data);
    },
  };
}
```

### 3. 使用方式
```bash
# 设置环境变量
export MY_SKILL_API_KEY="sk-xxxxxxxxxxxxxxxx"

# 运行OpenClaw
openclaw start
```

## 六、总结

OpenClaw提供了灵活且安全的环境变量管理机制，技能开发者可以根据需求选择合适的方式读取API密钥：
- 对于简单技能，直接使用`process.env`即可
- 对于正式技能，推荐使用`normalizeResolvedSecretInputString`支持配置文件和环境变量两种方式
- 对于复杂场景，可以使用SecretRef对象实现动态秘密来源切换

同时，通过环境变量白名单、敏感信息过滤和沙箱隔离等安全机制，OpenClaw确保了环境变量的安全使用，防止敏感信息泄露和注入攻击。