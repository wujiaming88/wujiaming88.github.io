---
title: "OpenClaw环境变量加载和使用机制研究"
date: 2026-03-03 04:29:00 +0000
categories: OpenClaw 技术研究
header:
  overlay_image: https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&h=400&fit=crop
  overlay_filter: 0.6
  caption: "Environment Variables"
---

# OpenClaw环境变量加载和使用机制研究报告

## 一、核心机制概述

OpenClaw提供了完善的环境变量加载和管理机制，主要用于安全地处理API密钥等敏感信息。其核心设计理念是：
- **配置优先，环境变量兜底**：优先使用配置文件中的设置，环境变量作为备选方案
- **类型安全的秘密引用**：支持通过SecretRef对象引用环境变量、文件或执行命令获取的秘密
- **自动注入机制**：技能可以自动从环境变量加载配置的API密钥
- **安全沙箱隔离**：对环境变量进行 sanitize 处理，防止注入攻击

## 二、环境变量文件位置与生效优先级

### 1. 环境变量文件位置

OpenClaw支持多种环境变量文件位置，按加载顺序排列：

#### （1）系统级环境变量
- **位置**：操作系统级别的环境变量，通过`export`命令设置
- **示例**：`export MY_SKILL_API_KEY="sk-xxxxxxxx"`
- **生效范围**：全局生效，影响所有OpenClaw实例

#### （2）用户级环境变量文件
- **位置**：`~/.openclaw/.env`
- **格式**：标准dotenv格式，每行一个环境变量
- **示例**：
  ```env
  MY_SKILL_API_KEY="sk-xxxxxxxx"
  NODE_ENV="production"
  ```
- **生效范围**：当前用户的所有OpenClaw实例

#### （3）项目级环境变量文件
- **位置**：项目根目录下的`.env`文件
- **格式**：标准dotenv格式
- **生效范围**：仅影响当前项目的OpenClaw实例

#### （4）运行时临时环境变量
- **位置**：通过命令行参数传递
- **示例**：`MY_SKILL_API_KEY="sk-xxxxxxxx" openclaw start`
- **生效范围**：仅影响当前运行的OpenClaw实例

### 2. 环境变量生效优先级

OpenClaw环境变量的生效优先级从高到低为：
```
运行时临时环境变量 > 项目级.env文件 > 用户级~/.openclaw/.env文件 > 系统级环境变量
```

### 3. 配置文件与环境变量的优先级

当配置文件和环境变量同时存在时，OpenClaw的优先级规则为：
- **显式配置优先**：如果配置文件中明确设置了值（非SecretRef），则优先使用配置文件中的值
- **SecretRef次之**：如果配置文件中使用了SecretRef引用环境变量，则解析对应的环境变量
- **环境变量兜底**：如果配置文件中未设置，且没有SecretRef引用，则直接读取环境变量

## 三、环境变量读取的三种方式

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

## 四、技能中读取API密钥的最佳实践

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

## 五、环境变量的安全机制

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

## 六、完整示例：开发一个使用环境变量的Python技能

### 1. 技能配置文件
```json
{
  "name": "my-python-skill",
  "version": "1.0.0",
  "description": "使用环境变量API密钥的Python示例技能",
  "metadata": {
    "primaryEnv": "MY_PYTHON_SKILL_API_KEY",
    "requires": {
      "env": ["MY_PYTHON_SKILL_API_KEY"]
    }
  },
  "config": {
    "apiKey": "${MY_PYTHON_SKILL_API_KEY}", // 环境变量引用模板
    "endpoint": "https://api.example.com/v1",
    "pythonPath": "/usr/bin/python3"
  }
}
```

### 2. 技能实现代码（Python）
```python
import os
import sys
import json
import requests
from typing import Dict, Any, Optional

def resolve_api_key(config: Optional[Dict[str, Any]]) -> Optional[str]:
    """
    从配置文件或环境变量解析API密钥
    :param config: 技能配置字典
    :return: API密钥或None
    """
    # 优先使用配置文件中的值
    if config and "apiKey" in config:
        api_key = config["apiKey"]
        # 如果是环境变量引用模板，解析对应的环境变量
        if api_key.startswith("${") and api_key.endswith("}"):
            env_var_name = api_key[2:-1]
            return os.getenv(env_var_name)
        return api_key
    
    # 环境变量作为备选
    return os.getenv("MY_PYTHON_SKILL_API_KEY")

def execute_skill(tool_call_id: str, args: Dict[str, Any], config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    执行Python技能
    :param tool_call_id: 工具调用ID
    :param args: 工具调用参数
    :param config: 技能配置
    :return: 执行结果
    """
    # 解析API密钥
    api_key = resolve_api_key(config)
    if not api_key:
        return {
            "success": False,
            "error": "missing_api_key",
            "message": "MY_PYTHON_SKILL_API_KEY环境变量未设置"
        }
    
    # 获取查询参数
    query = args.get("query")
    if not query:
        return {
            "success": False,
            "error": "missing_parameter",
            "message": "缺少必填参数: query"
        }
    
    # 获取API端点
    endpoint = config.get("endpoint", "https://api.example.com/v1")
    
    try:
        # 使用API密钥调用外部服务
        response = requests.post(
            f"{endpoint}/search",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={"query": query},
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        
        return {
            "success": True,
            "result": data
        }
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": "api_request_failed",
            "message": f"API请求失败: {str(e)}"
        }

if __name__ == "__main__":
    # 从命令行参数获取输入
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "missing_input",
            "message": "缺少输入参数"
        }))
        sys.exit(1)
    
    try:
        input_data = json.loads(sys.argv[1])
        tool_call_id = input_data.get("toolCallId", "")
        args = input_data.get("args", {})
        config = input_data.get("config", {})
        
        result = execute_skill(tool_call_id, args, config)
        print(json.dumps(result))
    except json.JSONDecodeError as e:
        print(json.dumps({
            "success": False,
            "error": "invalid_json",
            "message": f"无效的JSON输入: {str(e)}"
        }))
        sys.exit(1)
```

### 3. TypeScript包装器（用于OpenClaw集成）
```typescript
import { Type } from "@sinclair/typebox";
import { spawn } from "node:child_process";
import type { AnyAgentTool } from "./common.js";
import { jsonResult, readStringParam } from "./common.js";

const MyPythonSkillSchema = Type.Object({
  query: Type.String({ description: "查询字符串" }),
});

export function createMyPythonSkillTool(config?: OpenClawConfig): AnyAgentTool | null {
  const skillConfig = config?.skills?.entries?.["my-python-skill"];
  if (!skillConfig) return null;

  return {
    label: "我的Python技能",
    name: "my_python_skill",
    description: "使用环境变量API密钥的Python示例技能",
    parameters: MyPythonSkillSchema,
    execute: async (_toolCallId, args) => {
      const query = readStringParam(args, "query", { required: true });
      const pythonPath = skillConfig.config?.pythonPath || "python3";
      
      return new Promise((resolve) => {
        // 生成Python子进程执行技能
        const pythonProcess = spawn(pythonPath, [
          "-c",
          `import sys, json; sys.path.insert(0, '${__dirname}'); from my_python_skill import execute_skill; print(json.dumps(execute_skill('', ${JSON.stringify(args)}, ${JSON.stringify(skillConfig.config)})))`
        ]);
        
        let output = "";
        let errorOutput = "";
        
        pythonProcess.stdout.on("data", (data) => {
          output += data.toString();
        });
        
        pythonProcess.stderr.on("data", (data) => {
          errorOutput += data.toString();
        });
        
        pythonProcess.on("close", (code) => {
          if (code !== 0) {
            resolve(jsonResult({
              success: false,
              error: "python_process_failed",
              message: `Python进程执行失败: ${errorOutput}`
            }));
            return;
          }
          
          try {
            const result = JSON.parse(output);
            resolve(jsonResult(result));
          } catch (e) {
            resolve(jsonResult({
              success: false,
              error: "invalid_json_output",
              message: `Python脚本返回无效JSON: ${output}`
            }));
          }
        });
      });
    },
  };
}
```

### 4. 使用方式

#### （1）设置环境变量
```bash
# 方式1: 临时设置
export MY_PYTHON_SKILL_API_KEY="sk-xxxxxxxxxxxxxxxx"

# 方式2: 添加到~/.openclaw/.env文件
cat >> ~/.openclaw/.env << EOF
MY_PYTHON_SKILL_API_KEY="sk-xxxxxxxxxxxxxxxx"
EOF
```

#### （2）运行OpenClaw
```bash
openclaw start
```

#### （3）调用技能
```json
{
  "tool": "my_python_skill",
  "args": {
    "query": "example search query"
  }
}
```

## 七、总结

OpenClaw提供了灵活且安全的环境变量管理机制，技能开发者可以根据需求选择合适的方式读取API密钥：
- 对于简单技能，直接使用`process.env`即可
- 对于正式技能，推荐使用`normalizeResolvedSecretInputString`支持配置文件和环境变量两种方式
- 对于复杂场景，可以使用SecretRef对象实现动态秘密来源切换

同时，通过环境变量白名单、敏感信息过滤和沙箱隔离等安全机制，OpenClaw确保了环境变量的安全使用，防止敏感信息泄露和注入攻击。