# frozen_string_literal: true

Jekyll::Hooks.register :site, :post_write do |site|
  # Generate category pages
  site.categories.each do |category, posts|
    category_dir = File.join(site.dest, "categories", category.downcase.gsub(/\s+/, "-"))
    FileUtils.mkdir_p(category_dir)
    
    # Create category index page
    category_index = File.join(category_dir, "index.html")
    
    # Generate HTML directly with post data
    content = <<~HTML
    ---
    layout: category
    title: #{category}
    ---
    
    <ul class="post-list">
    HTML
    
    # Add each post to the list
    posts.each do |post|
      content << <<~POST
      <li>
        <span class="post-meta">#{post.date.strftime('%b %-d, %Y')}</span>
        <h2>
          <a class="post-link" href="#{post.url}">#{post.data['title']}</a>
        </h2>
      </li>
      POST
    end
    
    content << "</ul>"
    
    File.write(category_index, content)
  end
  
  # Generate tag pages
  site.tags.each do |tag, posts|
    tag_dir = File.join(site.dest, "tags", tag.downcase.gsub(/\s+/, "-"))
    FileUtils.mkdir_p(tag_dir)
    
    # Create tag index page
    tag_index = File.join(tag_dir, "index.html")
    
    # Generate HTML directly with post data
    content = <<~HTML
    ---
    layout: tag
    title: #{tag}
    ---
    
    <ul class="post-list">
    HTML
    
    # Add each post to the list
    posts.each do |post|
      content << <<~POST
      <li>
        <span class="post-meta">#{post.date.strftime('%b %-d, %Y')}</span>
        <h2>
          <a class="post-link" href="#{post.url}">#{post.data['title']}</a>
        </h2>
      </li>
      POST
    end
    
    content << "</ul>"
    
    File.write(tag_index, content)
  end
end