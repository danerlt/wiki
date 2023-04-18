import {navbar} from "vuepress-theme-hope";

// 精选图标：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#iconfont-%E7%B2%BE%E9%80%89%E5%9B%BE%E6%A0%87
export default navbar([
    {text: "博客", icon: "blog", link: "/blog"},
    {
        text: "后端",
        prefix: "/backend",
        children: [
            "python",
            "algorithm",
            "db",
            "dev-space",
            "devlop",
            "framework",
            "project",
        ],
    },
]);
