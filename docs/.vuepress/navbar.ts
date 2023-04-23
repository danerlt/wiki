import {navbar} from "vuepress-theme-hope";

// 精选图标：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#iconfont-%E7%B2%BE%E9%80%89%E5%9B%BE%E6%A0%87
export default navbar([
    {
        text: "归档",
        icon: "archive",
        link: "/archive/",
    },
    {
        text: "Python",
        icon: "python",
        prefix: "/python/",
        children: [
            {
                text: "Python基础",
                icon: "python",
                prefix: "base/",
                children: [
                    "python基础",
                    "numpy",
                    "pands",
                    "matplotlib",
                ]
            },
            {
                "text": "Web开发",
                icon: "web",
                prefix: "web/",
                children: [
                    "flask",
                    "fastapi",
                    "django",
                    "sqlalchemy",
                    "apscheduler",
                    "celery"
                ]
            },
            {
                text: "爬虫",
                icon: "spider",
                prefix: "spider/",
                children: [
                    "scrapy",
                    "selenium",
                    "requests",
                    "beautifulsoup",
                    "xpath",
                ]
            },
            {
                text: "数据分析",
                icon: "dataanalysis",
                prefix: "dataanalysis/",
                children: [
                    "数据清洗",
                    "数据预处理",
                    "数据分析",
                    "数据可视化",
                ]
            }
        ]
    },
    {
        text: "后端",
        icon: "backend",
        prefix: "/backend/",
        children: [
            {
                text: "Java",
                icon: "java",
                prefix: "java/",
                children: [
                    "Java基础",
                ]
            },
            {
                text: "Go",
                icon: "go",
                prefix: "go/",
                children: [
                    "Go基础",
                ]
            },
            {
                text: "开发",
                icon: "dev",
                prefix: "dev/",
                children: [
                    "设计模式",
                ]
            },
            {
                text: "中间件",
                icon: "middleware",
                prefix: "middleware/",
                children: [
                    "RabbitMQ",
                    "Kafka",
                    "ElasticSearch",
                    "Redis",
                ]
            },
            {
                text: "架构",
                icon: "arch",
                prefix: "arch/",
                children: [
                    "微服务",
                    "分布式",
                    "高并发",
                    "高可用",
                ]
            },
            {
                text: "框架",
                icon: "framework",
                prefix: "framework/",
                children: [
                    "Spring",
                ]
            }
        ]
    },
    {
        text: "算法",
        icon: "algorithm",
        prefix: "/algorithm/",
        children: [
            "算法基础",
            "数据结构",
            "排序算法",
            "查找算法",
            "动态规划",
            "贪心算法",
            "分治算法",
            "回溯算法",
            "位运算",
            "数学",
            "字符串",
            "数组",
            "链表",
            "栈",
            "队列",
            "哈希表",
            "树",
            "图",
        ]
    },
    {
        text: "机器学习",
        icon: "machinelearning",
        prefix: "/ml/",
        children: [
            "机器学习",
            "深度学习",
        ]
    },
    {
        text: "数据库",
        icon: "database",
        prefix: "/db/",
        children: [
            "MySQL",
            "MongoDB",
        ]
    },
    {
        text: "运维",
        icon: "operation",
        prefix: "/operation/",
        children: [
            "Linux",
            "Docker",
            "Kubernetes",
        ]
    },
    {
        text: "前端",
        icon: "frontend",
        prefix: "/frontend/",
        children: [
            "HTML",
            "CSS",
            "JavaScript",
            "TypeScript",
            "Vue",
        ]
    },
    {
        text: "常用工具",
        icon: "tools",
        prefix: "/tools/",
        children: [
            "Git",
            "Markdown",
            "Vim",
            "IDEA",
        ]
    },
    {
        text: "常用命令",
        icon: "command",
        prefix: "/command/",
        children: [
            "Linux",
            "Git",
            "Docker",
            "Kubernetes",
            "MySQL",
            "Redis",
            "MongoDB",
            "Vim",
        ]
    },
    {
        "text": "关于",
        "icon": "about",
        "link": "/about/",
    }
]);
