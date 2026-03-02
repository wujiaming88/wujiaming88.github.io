# frozen_string_literal: true

Jekyll::Hooks.register :site, :post_write do |site|
  # Generate category pages
  site.categories.each do |category, posts|
    category_dir = File.join(site.dest, "categories", category.downcase.gsub(/\s+/, "-"))
    FileUtils.mkdir_p(category_dir)
    
    # Create category index page
    category_index = File.join(category_dir, "index.html")
    
    # Generate proper Jekyll front matter with post references
    content = <<~HTML
    ---
    layout: category
    title: #{category}
    ---
    
    <ul class="post-list">
      {% for post in site.categories['#{category}'] %}
      <li>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
        <h2>
          <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
        </h2>
      </li>
      {% endfor %}
    </ul>
    HTML
    
    File.write(category_index, content)
  end
  
  # Generate tag pages
  site.tags.each do |tag, posts|
    tag_dir = File.join(site.dest, "tags", tag.downcase.gsub(/\s+/, "-"))
    FileUtils.mkdir_p(tag_dir)
    
    # Create tag index page
    tag_index = File.join(tag_dir, "index.html")
    
    # Generate proper Jekyll front matter with post references
    content = <<~HTML
    ---
    layout: tag
    title: #{tag}
    ---
    
    <ul class="post-list">
      {% for post in site.tags['#{tag}'] %}
      <li>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
        <h2>
          <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
        </h2>
      </li>
      {% endfor %}
    </ul>
    HTML
    
    File.write(tag_index, content)
  end
end