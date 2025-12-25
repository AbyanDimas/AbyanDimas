---
title: "Building Your First Neovim Plugin with Lua"
date: "2025-06-05"
author: "Abyan Dimas"
excerpt: "Extend your editor. How to write, structure, and publish a Neovim plugin using pure Lua."
coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop"
---

![Lua Code](https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop)

You love LazyVim. Now you want to create your own tools. Neovim's switch from VimScript to **Lua** triggered a renaissance in the ecosystem.

## Project Structure

A Neovim plugin is just a folder.

```text
my-plugin/
├── lua/
│   └── my-plugin/
│       └── init.lua
└── plugin/
    └── my-plugin.lua
```

## The Logic (`lua/my-plugin/init.lua`)

```lua
local M = {}

M.setup = function(opts)
    print("My Plugin Setup Called!")
end

M.hello = function()
    print("Hello from Neovim!")
    vim.notify("This is a notification", vim.log.levels.INFO)
end

return M
```

## The Command (`plugin/my-plugin.lua`)

Expose your Lua function as a Vim command.

```lua
vim.api.nvim_create_user_command('HelloPlugin', function()
    require('my-plugin').hello()
end, {})
```

## Loading It

Use `lazy.nvim` to load your local plugin:

```lua
{
  dir = "~/projects/my-plugin",
  config = function()
    require("my-plugin").setup()
  end
}
```

Restart Neovim and run `:HelloPlugin`. You are now a plugin author!
