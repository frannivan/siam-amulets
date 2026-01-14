package com.gigamulets.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RouteController {

    // Forward all non-api, non-static file requests to index.html
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/";
    }

    // Also handle nested routes just in case (e.g. /admin/products)
    @RequestMapping(value = "/**/{path:[^\\.]*}")
    public String redirectNested() {
        return "forward:/";
    }
}
