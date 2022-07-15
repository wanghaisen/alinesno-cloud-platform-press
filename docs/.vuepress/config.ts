import { defineUserConfig } from 'vuepress'
import { localTheme } from './theme'
const { path } = require('@vuepress/utils')

const { nprogressPlugin } = require('@vuepress/plugin-nprogress')
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
const { googleAnalyticsPlugin } = require('@vuepress/plugin-google-analytics')
import { clipboardPlugin } from "vuepress-plugin-clipboard";
const { mediumZoomPlugin } = require('@vuepress/plugin-medium-zoom')
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
import { feedPlugin } from "vuepress-plugin-feed2";
import { readingTimePlugin } from "vuepress-plugin-reading-time2";

export default defineUserConfig({
  lang: 'zh-CN',
  title: '企业级ACP数字中台',
  description: '能够灵活满足企业数字化建设中各种场景的需要，更高效、专注的沉淀业务和数据能力，进而形成企业的业务和数据中台。通过能力的灵活组合，快速的应对当前快节奏的市场需求，助力企业数字化转型的成功。',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['link', { rel: 'stylesheet', href: 'http://static.cloud.linesno.com/asserts/vendors/fontawesome/css/all.css' }]
  ],
  plugins: [
    clipboardPlugin({
      align: 'top' , 
      color: '#fff' , 
      successText: '复制成功!' , 
      successTextColor: '#fff' 
    }),
    // mdEnhancePlugin({
    //   // 启用流程图
    //   flowchart: true,
    //   // 启用 mermaid
    //   mermaid: true,
    // }),
    readingTimePlugin({
      // 你的选项
    }),
    feedPlugin({
      // 插件选项
      hostname: 'http://alinesno-platform.linesno.com' , 
      json: true
    }),
    mediumZoomPlugin({
      // 配置项
    }),
    '@renovamen/vuepress-plugin-baidu-tongji', {
      'ba': 'd56b5be4e3fa14164ffdc68ade2beef9'
    },
    docsearchPlugin({
      appId: 'SI4XZK527J',
      apiKey: 'b0df382dd6e02495ccca231de710a0c3',
      indexName: 'alinesno-cloud-platform',
      locales: {
        '/zh/': {
          placeholder: '搜索文档',
          translations: {
            button: {
              buttonText: '搜索文档',
              buttonAriaLabel: '搜索文档',
            },
            modal: {
              searchBox: {
                resetButtonTitle: '清除查询条件',
                resetButtonAriaLabel: '清除查询条件',
                cancelButtonText: '取消',
                cancelButtonAriaLabel: '取消',
              },
              startScreen: {
                recentSearchesTitle: '搜索历史',
                noRecentSearchesText: '没有搜索历史',
                saveRecentSearchButtonTitle: '保存至搜索历史',
                removeRecentSearchButtonTitle: '从搜索历史中移除',
                favoriteSearchesTitle: '收藏',
                removeFavoriteSearchButtonTitle: '从收藏中移除',
              },
              errorScreen: {
                titleText: '无法获取结果',
                helpText: '你可能需要检查你的网络连接',
              },
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭',
                searchByText: '搜索提供者',
              },
              noResultsScreen: {
                noResultsText: '无法找到相关结果',
                suggestedQueryText: '你可以尝试查询',
                reportMissingResultsText: '你认为该查询应该有结果？',
                reportMissingResultsLinkText: '点击反馈',
              },
            },
          },
        },
      },
    }),
    // 谷歌分析
    googleAnalyticsPlugin({
      // 配置项
      id: 'G-V0D6KNXG35',
    }),
    // 请求加载
    nprogressPlugin(),
    // 注册组件
    // registerComponentsPlugin({
    //   components: {
    //     iframeVideo: path.resolve(__dirname, './components/IframeVideo.vue'),
    //   },
    // }),
  ],
  
  theme: localTheme({
    logo: '/logo_1.png', // 注意图片放在 public 文件夹下
    docsDir: 'docs',
    repo: 'https://github.com/alinesno-cloud/alinesno-cloud-platform-press',
    repoLabel: 'Github',
    docsBranch: '2.1.0',
    editLink: true,
    // editLinkText: '编辑页面',
    sidebarDepth: 0,
    lastUpdated: true, 
    lastUpdatedText: 'Last Updated',
    contributors: false, 
    navbar: [
      // 嵌套 Group - 最大深度为 2
      {
        text: '首页',
        link: '/'
      },
      {
        text: '产品体系',
        link: '/platform/'
      },
      {
        text: '解决方案',
        link: '/solution/'
      },
      {
        text: '数字规划',
        children: [
          { text: '数字平台规划', link: '/design/overview/' },
          { text: '研发中台规划', link: '/framework/' },
          { text: '数据中台规划', link: '/data/framework/' }
        ]
      },
      {
        text: '业务建设',
        children: [
          { text: '组织架构', link: '/group/' }
        ]
      },
      {
        text: '环境建设',
        children: [
          { text: '技术平台建设', link: '/operation/' },
          { text: '研发中台建设', link: '/env/development/' },
          { text: '数据中台建设', link: '/data/onedata/' }
        ]
      },
      {
        text: '开发者',
        children: [
          { text: '新手入门', link: '/firstlearn/' },
          { text: '前端手册', link: '/front/' },
          { text: '后端手册', link: '/technique/' },
          { text: '经验分享', link: '/experience/' }
        ]
      },
      {
        text: '商业授权',
        link: '/prices/'
      },
      {
        text: '中台演示',
        link: '/display/'
      },
    ],
    sidebar: {
      '/firstlearn/': [
        {
          text: '新手入门',
          collapsible: true,
          children: genFirestLearnSidebar(1)
        },
        {
          text: '分布式入门',
          collapsible: true,
          children: genDistributedLearnSidebar(0)
        },
        {
          text: '第一个任务',
          collapsible: true,
          children: genFirestLearnSidebar(5)
        },
        {
          text: '开发服务云',
          collapsible: true,
          children: genFirestLearnSidebar(2)
        },
        {
          text: '流程服务云',
          collapsible: true,
          children: genFirestLearnSidebar(3)
        },
        {
          text: '数据服务云',
          collapsible: true,
          children: genFirestLearnSidebar(4)
        }
      ],
      '/experience/': [
        {
          text: '开发者社区',
          collapsible: true,
          children: genExperienceSidebar(0)
        },
        {
          text: '经验目录',
          collapsible: true,
          children: genExperienceSidebar(1)
        }
      ],
      '/prices/': [
        {
          text: '授权说明',
          collapsible: true,
          children: genPricesSidebar(0)
        },
        {
          text: '交付内容',
          collapsible: true,
          children: genPricesSidebar(1)
        }
      ],
      '/display/': [
        {
          text: '中台演示',
          collapsible: true,
          children: genSolutionPlatformSidebar()
        },
        {
          text: '组件演示',
          collapsible: true,
          children: genSolutionComponentSidebar()
        },
        {
          text: '运维演示',
          collapsible: true,
          children: genSolutionOperationSidebar()
        }
      ],
      '/design/overview': [
        {
          text: '平台介绍',
          collapsible: true,
          children: genDesignSidebar(1)
        },
        {
          text: '平台架构',
          collapsible: true,
          children: genDesignSidebar(2)
        },
        {
          text: '项目规划',
          collapsible: true,
          children: genDesignSidebar(3)
        },
        {
          text: '建设规划',
          collapsible: true,
          children: genDesignSidebar(4)
        }
      ],
      '/design/business': [
        {
          text: '业务中台架构',
          collapsible: true,
          children: genBusinessSidebar()
        },
        {
          text: '业务解决方案',
          collapsible: true,
          children: genBusinessSidebar()
        }
      ],
      '/design/technique': [
        {
          text: '平台介绍',
          collapsible: false,
          children: genTechniqueSidebar()
        }
      ],
      '/iot/': [
        {
          text: '行业需求',
          collapsible: true,
          children: genSectorDemandSidebar()
        },
        {
          text: '物联网架构设计',
          collapsible: true,
          children: genIotSystemSidebar()
        },
        {
          text: '功能架构规划',
          collapsible: true,
          children: genFunctionPlanSidebar()
        },
        {
          text: '场景集成',
          collapsible: true,
          children: genSceneSidebar()
        }
      ],
      '/framework/': [
        {
          text: '平台介绍',
          collapsible: true,
          children: genFrameworkAboutSidebar()
        },
        {
          text: '平台需求',
          collapsible: true,
          children: genFrameworkRequireSidebar()
        },
        {
          text: '平台架构',
          collapsible: true,
          children: genFrameworkSidebar()
        },
        {
          text: '项目规划',
          collapsible: true,
          children: genPlanSidebar()
        },
        {
          text: '项目管理',
          collapsible: true,
          children: genManagerSidebar()
        },
        {
          text: '服务规划',
          collapsible: true,
          children: genServiceSidebar()
        },
        {
          text: '平台管理',
          collapsible: true,
          children: genFrameworkManagerSidebar()
        }
      ],
      '/front/': [
        {
          text: '环境搭建',
          collapsible: true,
          children: genEnvironmentSidebar()
        },
        {
          text: '开发接入',
          collapsible: true,
          children: genAccessSidebar()
        },
        {
          text: '开发规范',
          collapsible: true,
          children: genStandardSidebar()
        },
        {
          text: '开发技术',
          collapsible: true,
          children: genFrontSidebar()
        }
      ],
      '/operation': [
        {
          text: '自动化运维',
          collapsible: true,
          children: genAutoOperationSidebar()
        },
        {
          text: '容器镜像',
          collapsible: true,
          children: genManagerContainerSidebar()
        },
        {
          text: '管理环境',
          collapsible: true,
          children: genManagerOperationSidebar()
        },
        {
          text: '基础软件',
          collapsible: true,
          children: genBaseSoftwareSidebar()
        },
        {
          text: '数据环境',
          collapsible: true,
          children: genDataEnvironmentSidebar()
        }
      ],
      '/env/development/': [
        {
          text: '基础服务',
          collapsible: true,
          children: genBaseServiceSidebar()
        },
        {
          text: '组件服务',
          collapsible: true,
          children: genToolsServiceSidebar()
        },
        {
          text: '业务服务',
          collapsible: true,
          children: genBusinessServiceSidebar()
        },
        {
          text: '运维监控',
          collapsible: true,
          children: genOperationServiceSidebar()
        }
      ],
      '/data/onedata/': [
        {
          text: '数据仓库',
          collapsible: true,
          children: genDatahourceSidebar(0)
        },
        {
          text: '数据治理',
          collapsible: true,
          children: genDataToolsSidebar(1)
        },
        {
          text: '运维监控',
          collapsible: true,
          children: genDataMonitorSidebar(2)
        }
      ],
      '/data/framework/': [
        {
          text: '架构设计',
          collapsible: true,
          children: genDataFrameworkSidebar()
        },
        {
          text: '数仓设计',
          collapsible: true,
          children: genDataWarehouseDesignSidebar()
        },
        {
          text: '数仓采集',
          collapsible: true,
          children: genDataWarehouseCollectSidebar()
        },
        {
          text: '数仓分析',
          collapsible: true,
          children: genDataWarehouseAnalyzeSidebar()
        },
        {
          text: '数据可视化',
          collapsible: true,
          children: genDataVisualSidebar()
        },
        {
          text: '机器学习',
          collapsible: true,
          children: genMachineLearningSidebar()
        },
        {
          text: '数据管理系统',
          collapsible: true,
          children: genDataManagerSidebar()
        },
        {
          text: '运维监控',
          collapsible: true,
          children: genDataOperationSidebar()
        }
      ],
      '/platform/': [
        {
          text: '产品体系',
          collapsible: true,
          children: genPlatformBusinessSidebar(1)
        },
        {
          text: '技术平台',
          collapsible: true,
          children: genPlatformPaaSSidebar()
        },
        {
          text: '微服务引擎',
          collapsible: true,
          children: genPlatformBusinessSidebar(2)
        },
        {
          text: '研发中台',
          collapsible: true,
          children: genPlatformBusinessSidebar(3)
        },
        // {
        //   text: '物联网中台',
        //   collapsible: true,
        //   children: genPlatformBusinessSidebar(4)
        // },
        {
          text: '数据中台',
          collapsible: true,
          children: genPlatformBusinessSidebar(5)
        },
        {
          text: '自动化运维',
          collapsible: true,
          children: genPlatformBusinessSidebar(6)
        },
        // {
        //   text: '视觉引擎',
        //   collapsible: true,
        //   children: genPlatformBusinessSidebar(7)
        // },
        {
          text: '辅助工具',
          collapsible: true,
          children: genPlatformBusinessSidebar(8)
        }
      ],
      '/solution/': [
        {
          text: '解决方案体系',
          collapsible: true,
          children: genSolutionSidebar(0)
        },
        {
          text: '场景解决方案',
          collapsible: true,
          children: genSolutionSidebar(2)
        },
        // {
        //   text: '成长解决方案',
        //   collapsible: true,
        //   children: genSolutionSidebar(1)
        // }
        // {
        //   text: '行业解决方案',
        //   collapsible: true,
        //   children: genSolutionSidebar(3)
        // }
      ],
      '/group/': [
        {
          text: '团队建设',
          collapsible: true,
          children: genGroupDeptSidebar()
        },
        {
          text: '组织架构',
          collapsible: true,
          children: genGroupRuleSidebar(0)
        },
        {
          text: '考核标准',
          collapsible: true,
          children: genGroupRuleSidebar(1)
        }
      ],
      '/business/': [
        {
          text: '项目组织',
          collapsible: true,
          children: genBusinessSidebar()
        },
        {
          text: '业务集成',
          collapsible: true,
          children: genBusinessBuildSidebar()
        }
        // {
        //   text: '业务定制',
        //   collapsible: true,
        //   children: genBusinessBuildSidebar()
        // }
      ],
      '/connect/': [
        {
          text: '概述',
          collapsible: true,
          children: genConnectReadmeSidebar()
        },
        {
          text: '连接器',
          collapsible: true,
          children: genConnectListSidebar()
        }
      ],
      '/technique/': [
        {
          text: '目录规划',
          collapsible: true,
          children: genCatalogSidebar()
        },
        {
          text: '环境搭建',
          collapsible: true,
          children: genEnvironmentSidebar()
        },
        {
          text: '代码生成器',
          collapsible: true,
          children: genCodeGenSidebar()
        },
        {
          text: '开发接入',
          collapsible: true,
          children: genAccessSidebar()
        },
        {
          text: '开发规范',
          collapsible: true,
          children: genStandardSidebar()
        },
        {
          text: '开发技术',
          collapsible: true,
          children: genDevTechniqueSidebar()
        },
        {
          text: '配置中心',
          collapsible: true,
          children: genConfigSidebar()
        },
        {
          text: '分布式技术',
          collapsible: true,
          children: genDubboSidebar()
        },
        {
          text: '单点登陆',
          collapsible: true,
          children: genSSOSidebar()
        },
        {
          text: '中台能力',
          collapsible: true,
          children: genGatewayOpenSidebar()
        },
        {
          text: '分布式消息',
          collapsible: true,
          children: genMessageSidebar()
        },
        {
          text: '网关服务',
          collapsible: true,
          children: genGatewaySidebar()
        },
        {
          text: '通知服务',
          collapsible: true,
          children: genNoticeSidebar()
        },
        {
          text: '分布式存储',
          collapsible: true,
          children: genStorageSidebar()
        },
        {
          text: '流程服务',
          collapsible: true,
          children: genWorkflowSidebar()
        },
        {
          text: '支付服务',
          collapsible: true,
          children: genPaymentSidebar()
        },
        {
          text: '自动化操作',
          collapsible: true,
          children: genOperationDevopsSidebar()
        }
      ],
      '/learn/': [
        {
          text: '人才团队建设',
          collapsible: true,
          children: genLearnSidebar(1)
        },
        {
          text: '企业中台建设',
          collapsible: true,
          children: genLearnSidebar(2)
        },
        // {
        // text: '数字化平台建设',
        // collapsible: true,
        // children: genLearnSidebar(4)
        // },
        {
          text: '过程培训文档',
          collapsible: true,
          children: genLearnSidebar(3)
        }
      ],
      '/about/': [
        {
          text: '关于',
          collapsible: false,
          children: genAboutSidebar()
        }
      ]
    }
  }),
});


/**
 * 视频教程菜单列表
 * @returns
 */
function genLearnSidebar(menus) {
  if (menus == 1) {
    const mapArr = [
      '/learn/02_初级培训员.md',
      '/learn/03_中级培训员.md',
      '/learn/04_高级培训员.md',
      '/learn/05_方案培训员.md'
    ]
    return mapArr.map(i => {
      return i
    })
  } else if (menus == 2) {
    const mapArr = [
      '/learn/11_视频培训.md',
      '/learn/11_2_数字化平台视频教程.md',
      '/learn/12_直播培训.md'
    ]
    return mapArr.map(i => {
      return i
    })
  } else if (menus == 3) {
    const mapArr = [
      '/learn/41_培训文档包.md',
      '/learn/42_高级培训文档.md',
      '/learn/43_软件工具包.md',
      '/learn/44_相关培训脚本.md',
      '/learn/45_最佳实践.md'
    ]
    return mapArr.map(i => {
      return i
    })
  } else if (menus == 4) {
    const mapArr = [
      '/learn/01_数字化/60_战略章节.md',
      '/learn/01_数字化/61_设计章节.md',
      '/learn/01_数字化/62_筹备章节.md',
      '/learn/01_数字化/63_建设章节.md',
      '/learn/01_数字化/64_落地章节.md',
      '/learn/01_数字化/65_成熟章节.md'
    ]
    return mapArr.map(i => {
      return i
    })
  }
}

/**
 * 物联网中台架构建设
 * @returns
 */
function genSectorDemandSidebar() {
  const mapArr = ['/iot/', '/iot/plan.md']
  return mapArr.map(i => {
    return i
  })
}

/**
 *
 * @param {概述} type
 * @returns
 */
function genFirestLearnSidebar(type) {
  var mapArr: string[] = []

  if (type == 0) {
    // mapArr = [
    //   '/firstlearn/RAEDME.md' ,
    // ]
  } else if (type == 1) {
    mapArr = [
      '/firstlearn/',
      '/firstlearn/02_学习成长中心.md',
      '/firstlearn/03_中台示例中心.md',
      '/firstlearn/18_持续集成入门.md',
      '/firstlearn/04_中台设计视频.md',
      '/firstlearn/04_中台公开课.md'
    ]
  } else if (type == 2) {
    mapArr = [
      '/firstlearn/05_快速入门.md',
      '/firstlearn/06_开发指南.md',
      '/firstlearn/07_开发资源与工具.md',
      '/firstlearn/08_开发文档.md',
      '/firstlearn/09_开发者认证.md'
    ]
  } else if (type == 3) {
    mapArr = [
      '/firstlearn/10_快速入门.md',
      '/firstlearn/11_用户手册.md',
      '/firstlearn/12_课程培训.md',
      '/firstlearn/13_Demo案例.md'
    ]
  } else if (type == 4) {
    mapArr = [
      '/firstlearn/14_快速入门.md',
      '/firstlearn/16_数据集成示例.md',
      '/firstlearn/17_学习课程.md'
    ]
  } else if (type == 5) {
    mapArr = [
      '/firstlearn/task/00_任务内容.md',
      '/firstlearn/task/01_基础计划.md',
      '/firstlearn/task/02_开始客户管理系统.md',
      '/firstlearn/task/03_第一个服务工程.md',
      '/firstlearn/task/04_第一个前端工程.md',
      '/firstlearn/task/05_引入其它组件.md',
      '/firstlearn/task/06_完成第一天任务.md'
    ]
  } else if (type == 6) {
    mapArr = [
      '/firstlearn/task/00_任务内容.md',
      '/firstlearn/task/01_基础计划.md',
      '/firstlearn/task/02_开始客户管理系统.md',
      '/firstlearn/task/03_第一个服务工程.md',
      '/firstlearn/task/04_第一个前端工程.md',
      '/firstlearn/task/05_引入其它组件.md',
      '/firstlearn/task/06_完成第一天任务.md'
    ]
  }

  return mapArr.map(i => {
    return i
  })
}

function genIotSystemSidebar() {
  const mapArr = [
    '/iot/02_架构设计/01_业务架构设计.md',
    '/iot/02_架构设计/02_技术架构设计.md',
    '/iot/02_架构设计/03_AI视觉架构设计.md',
    '/iot/02_架构设计/04_服务规划.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genFunctionPlanSidebar() {
  const mapArr = ['/iot/03_功能架构/01_功能架构规划.md']
  return mapArr.map(i => {
    return i
  })
}

function genSceneSidebar() {
  const mapArr = [
    '/iot/04_场景案例/01_智慧社区场景.md',
    '/iot/04_场景案例/03_AI视觉场景.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 * 自动化运维管理
 * @returns
 */
function genAutoOperationSidebar() {
  const mapArr = [
    '/operation/',
    '/operation/document/01_基础规则.md',
    // '/operation/env.md',
    '/operation/document/01_自动化操作脚本.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 * 容器镜像
 * @returns
 */
function genManagerContainerSidebar() {
  const mapArr = [
    '/operation/35_container/01_镜像规划.md',
    '/operation/35_container/02_制作和使用.md'
    // '/operation/35_container/03_应用镜像管理.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genManagerOperationSidebar() {
  const mapArr = [
    '/operation/01_gitbook/01_GitBook安装.md',
    '/operation/01_gitbook/02_Git安装.md',
    '/operation/02_email/01_邮件申请及开通客户端配置.md',
    '/operation/03_Jira/01_Jira软件安装及破解.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genBaseSoftwareSidebar() {
  const mapArr = [
    '/operation/05_jdk/01_Linux的JDK配置.md',
    '/operation/09_nginx/01_nginx单点安装.md',
    '/operation/09_nginx/04_kong单机安装.md',
    '/operation/07_kafka/01_Kafka单点安装.md',
    '/operation/08_mysql/04_MySQL网络安装.md',
    '/operation/27_minio/01_MinIO单机安装.md',
    '/operation/14_nexus/01_Nexus安装配置.md',
    '/operation/36_gitlab/01_Gitlab安装.md',
    '/operation/37_gitea/01_Gitea安装.md',
    '/operation/13_jenkins/01_Jenkins安装.md',
    '/operation/13_jenkins/01_Jenkins插件安装配置.md',
    '/operation/16_sonar/01_Sonar安装.md',
    '/operation/33_docker/01_Docker在线安装.md',
    '/operation/11_zookeeper/01_Zookeeper单点安装.md',
    '/operation/19_ansible/01_Ansible源码安装.md',
    '/operation/22_elk/04_elk单机版本安装.md',
    '/operation/22_elk/05_elastalert安装.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genDataEnvironmentSidebar() {
  const mapArr = [
    '/operation/39_Apache Hudi/05_Centos7部署CDH6.2.0.md',
    '/operation/39_Apache Hudi/01_ApacheFlink安装.md',
    '/operation/39_Apache Hudi/02_Apachekafka安装.md',
    '/operation/39_Apache Hudi/03_scala安装.md',
    '/operation/39_Apache Hudi/04_ApacheHudi安装.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 * 研发手册
 * @returns
 */
function genCatalogSidebar() {
  const mapArr = ['/technique/', '/technique/01_开发技术/17_组件功能列表.md']
  return mapArr.map(i => {
    return i
  })
}

function genEnvironmentSidebar() {
  const mapArr = ['/technique/11_环境搭建/01_平台环境要求.md']
  return mapArr.map(i => {
    return i
  })
}

function genCodeGenSidebar() {
  const mapArr = [
    '/technique/13_代码生成器/',
    '/technique/13_代码生成器/01_低代码生成.md',
    '/technique/13_代码生成器/02_前端代码生成.md',
    // '/technique/13_代码生成器/03_App代码生成.md',
    '/technique/13_代码生成器/04_自动发布集成.md',
    // '/technique/13_代码生成器/05_监控链接集成.md',
    // '/technique/13_代码生成器/06_登陆认证集成.md',
    '/technique/13_代码生成器/07_权限用户集成.md',
    '/technique/13_代码生成器/08_微服务集成.md',
    '/technique/13_代码生成器/09_容器化集成.md',
    '/technique/13_代码生成器/10_通用CURD集成.md',
    '/technique/13_代码生成器/11_示例代码集成.md',
    '/technique/13_代码生成器/12_JWT集成.md',
    '/technique/13_代码生成器/13_版本管理集成.md',
    // '/technique/13_代码生成器/14_容器仓库集成.md',
    // '/technique/13_代码生成器/15_管理后台集成.md',
    '/technique/13_代码生成器/16_分布式存储集成.md'
    // '/technique/13_代码生成器/17_多种验证码集成.md',
    // '/technique/13_代码生成器/18_多种发布集成.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genAccessSidebar() {
  const mapArr = [
    '/technique/09_开发接入/01_HelloWorld.md',
    '/technique/09_开发接入/02_生成代码.md',
    '/technique/09_开发接入/03_配置菜单.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genStandardSidebar() {
  const mapArr = [
    '/technique/03_项目规范/01_服务工程规范.md',
    '/technique/03_项目规范/02_前端工程规范.md',
    '/technique/03_项目规范/03_Java编码规范.md',
    '/technique/03_项目规范/04_web编码规范.md',
    '/technique/03_项目规范/07_UI自动化规范.md',
    '/technique/03_项目规范/05_sql编码规范.md',
    '/technique/03_项目规范/06_版本管理规范.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genDevTechniqueSidebar() {
  const mapArr = [
    '/technique/01_开发技术/02_默认功能.md',
    '/technique/01_开发技术/30_登陆配置.md',
    '/technique/01_开发技术/26_按钮权限.md',
    '/technique/01_开发技术/37_Jdbc操作.md',
    // '/technique/01_开发技术/39_Mybatis集成.md',
    '/technique/01_开发技术/28_租户配置.md',
    '/technique/01_开发技术/22_服务集成教程.md',
    '/technique/01_开发技术/08_前端教程.md',
    '/technique/01_开发技术/09_发布教程.md',
    '/technique/01_开发技术/20_获取当前用户.md',
    '/technique/06_开发教程/01_本地调试.md',
    '/technique/01_开发技术/11_异常处理.md',
    '/technique/01_开发技术/12_日志处理.md',
    '/technique/01_开发技术/37_页面搜索.md',
    '/technique/01_开发技术/13_缓存使用.md',
    '/technique/01_开发技术/14_消息使用.md',
    '/technique/01_开发技术/24_多数据库源.md',
    '/technique/01_开发技术/25_配置加密.md',
    '/technique/01_开发技术/23_表单提交校验.md',
    '/technique/01_开发技术/14_Excel导出.md',
    '/technique/01_开发技术/34_文件上传.md',
    '/technique/01_开发技术/31_CDN配置.md',
    '/technique/01_开发技术/32_国际化支持.md',
    '/technique/01_开发技术/33_部署教程.md',
    '/technique/01_开发技术/35_代码转换和规范.md',
    '/technique/01_开发技术/36_初始化应用.md',
    '/technique/01_开发技术/38_组件转SDK.md',
    '/technique/01_开发技术/41_Swagger支持.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genConfigSidebar() {
  const mapArr = [
    '/technique/04_配置中心/01_使用场景.md',
    '/technique/04_配置中心/02_使用方式.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

// 单点登陆
function genSSOSidebar() {
  const mapArr = [
    '/technique/14_单点登陆/01_统一账号登陆.md',
    '/technique/14_单点登陆/02_企业品牌化配置.md',
    '/technique/14_单点登陆/03_微服务网关认证.md',
    '/technique/14_单点登陆/04_OpenId集成认证.md',
    '/technique/14_单点登陆/05_第三方账号同步.md',
    '/technique/14_单点登陆/06_系统登陆配置.md',
    '/technique/14_单点登陆/07_去掉单点登陆集成.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

// 中台能力
function genGatewayOpenSidebar() {
  const mapArr = [
    '/technique/15_中台开放能力/01_中台能力架构.md',
    '/technique/15_中台开放能力/02_应用集成说明.md',
    '/technique/15_中台开放能力/03_网关自定义配置.md',
    '/technique/15_中台开放能力/04_接口权限管理.md',
    '/technique/15_中台开放能力/05_集成业务中台.md',
    '/technique/15_中台开放能力/06_生产发布文档.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

// 支付服务
function genPaymentSidebar() {
  const mapArr = [
    '/technique/18_支付服务/01_聚合支付架构.md',
    '/technique/18_支付服务/02_应用集成支付服务.md',
    '/technique/18_支付服务/03_支付平台操作手册.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

// 流程服务
function genWorkflowSidebar() {
  const mapArr = [
    '/technique/22_流程服务/01_流程架构设计.md',
    '/technique/22_流程服务/02_任务接入流程.md',
    '/technique/22_流程服务/03_流程接口服务.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

// 通知服务
function genNoticeSidebar() {
  const mapArr = [
    '/technique/17_通知服务/01_通知服务场景.md',
    '/technique/17_通知服务/02_第三方通知集成.md',
    '/technique/17_通知服务/04_通知技术构架.md',
    '/technique/17_通知服务/03_业务集成使用.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

// 自动化操作监控
function genOperationDevopsSidebar() {
  const mapArr = [
    '/technique/20_自动化操作/01_自动化操作架构.md',
    '/technique/20_自动化操作/02_移动端自动化操作.md',
    '/technique/20_自动化操作/03_集成多种自动化操作示例.md'
  ]

  return mapArr.map(i => {
    return i
  })
}

// 分布式存储
function genStorageSidebar() {
  const mapArr = [
    '/technique/21_存储服务/01_接入存储架构.md',
    '/technique/21_存储服务/02_前后端接入云存储方式.md',
    '/technique/21_存储服务/03_多存储在线切换.md',
    '/technique/21_存储服务/04_接入示例.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

// 分布式消息
function genMessageSidebar() {
  const mapArr = [
    '/technique/19_分布式消息/01_分布式消息架构.md',
    '/technique/19_分布式消息/02_业务消息集成.md',
    '/technique/19_分布式消息/04_消息管理平台手册.md',
    '/technique/19_分布式消息/05_业务集成最佳实践.md',
    '/technique/19_分布式消息/03_消息异常处理.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

// 网关服务
function genGatewaySidebar() {
  const mapArr = [
    '/technique/16_网关服务/01_网关场景构架.md',
    '/technique/16_网关服务/02_网关配置.md',
    '/technique/16_网关服务/03_接口策略配置.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genDubboSidebar() {
  const mapArr = [
    '/technique/05_服务熔断/02_服务熔断说明.md',
    '/technique/05_服务熔断/01_Dubbo实现服务熔断.md',
    '/technique/01_开发技术/18_防重复提交.md',
    '/technique/01_开发技术/27_分布式定时任务.md',
    '/technique/01_开发技术/16_分布式锁.md',
    '/technique/01_开发技术/19_分布式限流.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 *
 * @returns 前端脚本
 */
function genFrontSidebar() {
  const mapArr = [
    '/front/01_新增页面.md',
    '/front/02_请求流程.md',
    '/front/03_引入依赖.md',
    '/front/04_注册组件.md',
    '/front/05_权限使用.md',
    '/front/06_多级目录.md',
    '/front/08_使用图标.md',
    '/front/09_使用字典.md',
    '/front/10_使用参数.md',
    '/front/11_异常处理.md',
    '/front/12_应用路径.md',
    '/front/13_布局.md',
    '/front/14_路由和导航栏.md',
    '/front/15_权限验证.md',
    '/front/16_标签栏导航.md',
    '/front/17_样式.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 * 业务建设菜单列表
 * @returns
 */
function genBusinessSidebar() {
  const mapArr = [
    '/business/01_方案概述.md',
    '/business/project/01_多部门并发行开发.md',
    '/business/project/02_外包团队业务开发.md',
    '/business/project/03_代码自动生成.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genBusinessBuildSidebar() {
  const mapArr = [
    '/business/build/01_业务服务Docker镜像化.md',
    '/business/build/02_生产服务Docker镜像化.md',
    '/business/build/03_企业开发环境私有云环境.md',
    '/business/build/04_公有云服务采购及指导.md',
    '/business/build/05_基于Kubernetes的容器云平台.md',
    '/business/build/06_业务融合云原生基础设施中台.md',
    '/business/build/07_业务中台与云平台整合.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 * 组织搭建菜单列表
 * @returns
 */
function genGroupDeptSidebar() {
  const mapArr = [
    '/group/01_部门建设/'
    // '/group/01_部门建设/01_研发部门概述.md',
    // '/group/01_部门建设/02_部门愿景.md',
    // '/group/01_部门建设/04_组织结构.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genGroupRuleSidebar(type) {
  var mapArr = [
    '/group/02_管理体系/02_管理概述.md',
    '/group/02_管理体系/10_项目管理.md',
    '/group/02_管理体系/12_岗位职责.md',
    '/group/02_管理体系/19_能力模型.md',
    // '/group/02_管理体系/13_面试流程.md',
    '/group/02_管理体系/03_入职流程.md',
    // '/group/02_管理体系/16_新人培训.md',
    '/group/02_管理体系/08_培训体系.md',
    // '/group/02_管理体系/15_请假制度.md',
    // '/group/02_管理体系/09_离职流程.md',
    '/group/02_管理体系/05_成长梯度.md',
    '/group/02_管理体系/04_汇报制度.md',
    '/group/02_管理体系/07_绩效考核.md',
    // '/group/02_管理体系/17_工作规范.md',
    '/group/02_管理体系/18_晋升定级.md'
  ]

  if (type == 1) {
    mapArr = [
      '/group/03_考核标准/01_学习期考核.md',
      '/group/03_考核标准/02_提升期考核.md',
      '/group/03_考核标准/03_代码规范考核.md',
      '/group/03_考核标准/04_架构师考核.md'
    ]
  }

  return mapArr.map(i => {
    return i
  })
}

/**
 * 中台连接器说明
 * @returns
 */
// function genPlatformPaaSSidebar() {
//   const mapArr = ['/connect/01_方案概述.md']
//   return mapArr.map(i => {
//     return i
//   })
// }

/**
 * 中台连接器说明
 * @returns
 */
function genConnectReadmeSidebar() {
  const mapArr = ['/connect/00_连接器说明.md']
  return mapArr.map(i => {
    return i
  })
}

/**
 * 中台连接器列表
 * @returns
 */
function genConnectListSidebar() {
  const mapArr = [
    '/connect/01_基础权限平台.md',
    '/connect/02_基础通知平台.md',
    '/connect/03_公共存储平台.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 * 中台搭建菜单列表
 * @returns
 */
function genPlatformPaaSSidebar() {
  const mapArr = [
    // '/platform/01_方案概述.md',
    '/platform/paas/01_持续集成平台.md'
    // '/platform/paas/02_分布式缓存.md',
    // '/platform/paas/03_代码管理平台.md',
    // '/platform/paas/04_企业私服平台.md',
    // '/platform/paas/05_代码自动检测平台.md',
    // '/platform/paas/06_项目管理平台.md',
    // '/platform/paas/07_分布式消息平台.md',
    // '/platform/paas/08_分布式注册中心.md',
    // '/platform/paas/09_监控预警平台.md',
    // '/platform/paas/10_运维转发监控中心.md',
    // '/platform/paas/11_企业私有云平台.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 * 技术平台
 */
function genPlatformBusinessSidebar(type) {
  var mapArr = ['/platform/', '/platform/CHANGELOG.md']

  if (type == 1) {
    // mapArr = ['/platform/business/02_产品体系.md']
  } else if (type == 2) {
    mapArr = [
      '/platform/business/12_技术中台/01_微服务研发引擎.md',
      '/platform/business/12_技术中台/01_前端框架引擎.md'
      // '/platform/business/12_技术中台/02_DevOps研发体系.md'
    ]
  } else if (type == 3) {
    mapArr = [
      '/platform/business/13_研发中台/01_基础权限管理平台.md',
      '/platform/business/13_研发中台/02_云门户管理平台.md',
      '/platform/business/13_研发中台/03_通知管理平台.md',
      '/platform/business/13_研发中台/04_支付管理平台.md',
      '/platform/business/13_研发中台/05_文档打印管理平台.md',
      '/platform/business/13_研发中台/06_存储管理平台.md',
      '/platform/business/13_研发中台/07_工作流管理平台.md',
      '/platform/business/13_研发中台/08_数据开放平台.md',
      // '/platform/business/13_研发中台/09_分布式定时任务平台.md',
      '/platform/business/13_研发中台/11_单点登陆管理平台.md',
      // '/platform/business/13_研发中台/12_中台管理平台.md',
      // '/platform/business/13_研发中台/13_数据报表管理平台.md',
      '/platform/business/13_研发中台/14_CMS内容管理平台.md'
    ]
  } else if (type == 4) {
    mapArr = [
      '/platform/business/15_物联网中台/01_网关服务平台.md',
      '/platform/business/15_物联网中台/02_物联网管理平台.md'
    ]
  } else if (type == 5) {
    mapArr = [
      // '/platform/business/14_数据中台/05_数据中台管理体系.md',
      '/platform/business/14_数据中台/06_数据上报服务.md',
      '/platform/business/14_数据中台/01_ETL在线调试平台.md',
      '/platform/business/14_数据中台/07_主数据管理服务.md',
      '/platform/business/14_数据中台/08_数据开发服务.md'
      // '/platform/business/14_数据中台/02_数据大屏管理平台.md',
      // '/platform/business/14_数据中台/03_实时计算仓库.md',
      // '/platform/business/14_数据中台/04_离线计算仓库.md'
    ]
  } else if (type == 6) {
    mapArr = [
      '/platform/business/18_运维中台/01_审计日志监控平台.md',
      '/platform/business/18_运维中台/02_Ansible自动化操作平台.md'
    ]
  } else if (type == 7) {
    mapArr = [
      '/platform/business/16_视觉中台/01_视觉模型训练平台.md',
      '/platform/business/16_视觉中台/02_视觉目标检测平台.md',
      '/platform/business/16_视觉中台/03_天网视频流分析平台.md'
    ]
  } else if (type == 8) {
    mapArr = [
      '/platform/business/19_业务中台/01_代码生成脚手架.md'
      // '/platform/business/19_业务中台/02_代码快速生成器.md',
      // '/platform/business/19_业务中台/03_低代码开发平台.md'
    ]
  }

  return mapArr.map(i => {
    return i
  })
}

function genPlatformsSidebar() {
  const mapArr = ['/platform/01_方案概述.md']
  return mapArr.map(i => {
    return i
  })
}

/**
 * 环境搭建菜单列表
 * @returns
 */
function genEnvSidebar(menus) {
  if (menus == 1) {
    const mapArr = ['/env/01_方案概述.md']

    return mapArr.map(i => {
      return i
    })
  } else if (menus == 2) {
    const mapArr = ['/env/01_方案概述.md']

    return mapArr.map(i => {
      return i
    })
  } else if (menus == 3) {
    const mapArr = ['/env/01_方案概述.md']

    return mapArr.map(i => {
      return i
    })
  } else if (menus == 4) {
    const mapArr = ['/env/01_方案概述.md']

    return mapArr.map(i => {
      return i
    })
  }
}

//数据中台架构

function genDataFrameworkSidebar() {
  const mapArr = [
    '/data/framework/',
    '/data/framework/01_业务架构/02_数中建设目标.md',
    '/data/framework/01_业务架构/03_业务架构设计.md',
    '/data/framework/01_业务架构/04_技术架构设计.md',
    '/data/framework/10_其它/01_注意事项.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genDataWarehouseDesignSidebar() {
  const mapArr = [
    '/data/framework/02_数据仓库/01_数据仓库.md',
    '/data/framework/02_数据仓库/02_数仓分层.md',
    '/data/framework/02_数据仓库/04_环境规划.md',
    '/data/framework/02_数据仓库/03_数仓规范.md',
    '/data/framework/04_数据同步/01_同步策略.md',
    '/data/framework/04_数据同步/02_维度建模.md',
    '/data/framework/04_数据同步/03_数据仓库建模.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genDataWarehouseCollectSidebar() {
  const mapArr = [
    '/data/framework/03_业务数据采集/01_用户行为数据.md',
    '/data/framework/03_业务数据采集/02_业务数据采集.md',
    '/data/framework/03_业务数据采集/03_访问日志数据采集.md',
    '/data/framework/03_业务数据采集/04_数据采集汇总.md',
    '/data/framework/03_业务数据采集/05_数据维度汇总.md',
    '/data/framework/03_业务数据采集/06_应用数据汇总.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genDataWarehouseAnalyzeSidebar() {
  const mapArr = [
    '/data/framework/05_数据分析/03_数据指标.md',
    '/data/framework/05_数据分析/01_离线计算.md',
    '/data/framework/05_数据分析/02_实时计算.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genDataVisualSidebar() {
  const mapArr = [
    '/data/framework/06_数据可视化/01_报表展示.md',
    '/data/framework/06_数据可视化/02_数据大屏.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genMachineLearningSidebar() {
  const mapArr = [
    '/data/framework/07_机器学习/04_推荐系统.md',
    '/data/framework/07_机器学习/01_数据建模.md',
    '/data/framework/07_机器学习/02_模型学习.md'
    // '/data/framework/07_机器学习/03_人物画像.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genDataManagerSidebar() {
  const mapArr = [
    // '/data/framework/08_管理系统/09_产品规划.md',
    '/data/framework/08_管理系统/03_ETL在线调试平台.md',
    // '/data/framework/08_管理系统/07_数据开发平台.md',
    '/data/framework/08_管理系统/05_数据分析平台.md',
    '/data/framework/08_管理系统/06_数据治理平台.md',
    '/data/framework/08_管理系统/01_指标管理系统.md',
    '/data/framework/08_管理系统/02_数据质量中心.md',
    '/data/framework/08_管理系统/04_数据开放平台.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genDataOperationSidebar() {
  const mapArr = [
    '/data/framework/09_运维监控/01_监控管理.md',
    '/data/framework/09_运维监控/02_预警管理.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 * 数字规划菜单列表
 * @returns
 */
function genDesignSidebar(menus) {
  if (menus == 1) {
    // 平台介绍
    const mapArr = ['/design/overview/']

    return mapArr.map(i => {
      return i
    })
  } else if (menus == 2) {
    // 平台架构
    const mapArr = [
      '/design/overview/04_数字化战略架构.md',
      '/design/overview/05_技术平台架构设计.md'
    ]

    return mapArr.map(i => {
      return i
    })
  } else if (menus == 3) {
    // 项目规划
    const mapArr = [
      '/design/overview/13_项目管理架构设计.md',
      '/design/overview/14_项目组织架构设计.md',
      '/design/overview/15_团队管理架构设计.md'
    ]

    return mapArr.map(i => {
      return i
    })
  } else if (menus == 4) {
    // 建设规划
    const mapArr = [
      '/design/overview/17_建设过程整体方案.md',
      '/design/overview/19_核心业务建设方案.md',
      '/design/overview/20_多业务整合建设方案.md',
      '/design/overview/16_新旧业务整合迁移方案.md'
    ]

    return mapArr.map(i => {
      return i
    })
  }
}

/**
 * 研发平台架构设计
 * @returns
 */
function genFrameworkAboutSidebar() {
  const mapArr = ['/framework/', '/framework/plan.md']
  return mapArr.map(i => {
    return i
  })
}

function genFrameworkRequireSidebar() {
  const mapArr = [
    '/framework/require/01_针对痛点.md',
    '/framework/require/02_解决方案.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genFrameworkSidebar() {
  const mapArr = [
    '/framework/essentials/01_总体架构设计.md',
    '/framework/essentials/02_中台架构设计.md',
    '/framework/essentials/02_01_平台技术构架.md',
    '/framework/essentials/03_服务架构设计.md',
    '/framework/essentials/06_平台运维架构.md',
    // '/framework/essentials/07_容器架构设计.md',
    '/framework/essentials/08_网关架构设计.md',
    '/framework/essentials/09_持续集成设计.md'
    // '/framework/essentials/10_中台战略设计.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genPlanSidebar() {
  const mapArr = [
    '/framework/advanced/01_项目结构设计.md',
    '/framework/advanced/02_基础模块设计.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genManagerSidebar() {
  const mapArr = [
    '/framework/manager/01_文档管理.md',
    '/framework/manager/02_代码管理.md',
    '/framework/manager/03_项目管理.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genServiceSidebar() {
  const mapArr = [
    '/framework/service/01_服务规划规范.md',
    '/framework/service/02_基础服务规划.md',
    '/framework/service/03_业务服务规划.md',
    '/framework/service/04_应用服务规划.md',
    '/framework/service/09_示例服务规划.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

function genFrameworkManagerSidebar() {
  const mapArr = [
    // '/framework/manager/01_开发平台管理规划.md',
    '/framework/manager/04_文档目录管理.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 * 研发中台方案菜单列表
 * @returns
 */
function genTechniqueSidebar() {
  const mapArr = ['/design/technique/01_方案概述.md']
  return mapArr.map(i => {
    return i
  })
}

/**
 * 处理解决方案菜单列表
 * @returns
 */
function genSolutionPlatformSidebar() {
  const mapArr = [
    '/display/',
    // '/display/platform/04_研发中台服务.md',
    '/display/platform/02_数据中台服务.md',
    '/display/platform/03_运维平台.md'
  ]

  return mapArr.map(i => {
    return i
  })
}

/**
 * 组件演示
 * @returns
 */
function genSolutionComponentSidebar() {
  const mapArr = [
    // '/display/platform/02_数据中台.md',
    // '/display/platform/03_运维平台.md',

    '/display/component/01_统一权限服务.md',
    '/display/component/02_研发门户服务.md',
    '/display/component/03_门户管理服务.md',
    '/display/component/04_单点登陆服务.md',
    '/display/component/05_代码生成器服务.md',
    '/display/component/06_基础通知组件.md',
    '/display/component/07_公共存储组件.md',
    '/display/component/08_可靠消息服务.md',
    '/display/component/09_网关管理服务.md',
    '/display/component/10_开放平台服务.md',
    '/display/component/11_微型工作流服务.md',
    '/display/component/12_电子签名打印服务.md',
    '/display/component/13_聚合支付服务.md',
    '/display/component/14_Oauth2授权服务.md',
    '/display/component/15_集团权限管理服务.md',
    '/display/component/16_内容管理服务.md',
    '/display/component/17_会员管理服务.md',
    '/display/component/18_基础电商服务.md'

    // '/display/platform/04_文档计划.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 * 运维组件演示
 * @returns
 */
function genSolutionOperationSidebar() {
  const mapArr = [
    '/display/component/19_审计日志监控服务.md',
    '/display/component/20_异常报警监控服务.md'

    // '/display/platform/04_文档计划.md'
  ]
  return mapArr.map(i => {
    return i
  })
}

/**
 * 获取关于我们的菜单列表
 * @returns
 */
function genAboutSidebar() {
  const mapArr = ['/about/01_方案概述.md']
  return mapArr.map(i => {
    return i
  })
}

function genAdvancedSidebar() {
  const mapArr = ['/display/01_方案概述.md']
  return mapArr.map(i => {
    return i
  })
}

// 分布式新手入门
function genDistributedLearnSidebar(type) {
  const mapArr = [
    '/firstlearn/dubbo/00_学习计划.md',
    '/firstlearn/dubbo/01_安装软件并建立开发工程.md',
    '/firstlearn/dubbo/02_建表使用jdbc对表进行增删查改.md',
    '/firstlearn/dubbo/03_单元测试.md',
    '/firstlearn/dubbo/04_Jenkins安装.md',
    '/firstlearn/dubbo/06_html转成jsp文件以后前后端显示.md',
    '/firstlearn/dubbo/07_如何实现前后端数据交互.md',
    '/firstlearn/dubbo/08_dubbo框架和zookeeper的注册.md'
  ]

  return mapArr.map(i => {
    return i
  })
}

// >>>>>>>>>>>>>>>>>>>>>>>>>> 数据环境 >>>>>>>>>>>>>>>>>>.

// 数据仓库
function genDatahourceSidebar(type) {
  const mapArr = [
    '/data/onedata/01_数据仓库.md',
    '/data/onedata/04_元数据管理.md',
    '/data/onedata/02_实时环境.md',
    '/data/onedata/03_监控环境.md'
  ]

  return mapArr.map(i => {
    return i
  })
}

// 数据治理
function genDataToolsSidebar(type) {
  const mapArr = [
    '/data/onedata/04_数据集成服务.md',
    '/data/onedata/05_数据开发服务.md',
    '/data/onedata/06_主数据管理服务.md',
    '/data/onedata/07_实时计算服务.md',
    '/data/onedata/08_数据开放服务.md'
  ]

  return mapArr.map(i => {
    return i
  })
}

// 运维监控
function genDataMonitorSidebar(type) {
  const mapArr = [
    '/data/onedata/09_监控运维服务.md',
    '/data/onedata/10_集成监控预警服务.md'
  ]

  return mapArr.map(i => {
    return i
  })
}

// >>>>>>>>>>>>>>>>>>>>>>>>>> 研发中台环境 >>>>>>>>>>>>>>>>>>.

// 基础服务
function genBaseServiceSidebar() {
  const mapArr = [
    '/env/development/01_统一权限服务.md',
    '/env/development/02_研发门户服务.md',
    '/env/development/14_Oauth2授权服务.md',
    '/env/development/05_代码生成器服务.md',
    '/env/development/03_门户管理服务.md'
  ]

  return mapArr.map(i => {
    return i
  })
}

// 组件服务
function genToolsServiceSidebar() {
  const mapArr = [
    '/env/development/06_基础通知组件.md',
    '/env/development/07_公共存储组件.md',
    '/env/development/08_可靠消息服务.md',
    '/env/development/09_网关管理服务.md',
    '/env/development/10_开放平台服务.md',
    '/env/development/11_微型工作流服务.md',
    '/env/development/12_电子签名打印服务.md',
    '/env/development/13_聚合支付服务.md'
  ]

  return mapArr.map(i => {
    return i
  })
}

// 业务服务
function genBusinessServiceSidebar() {
  const mapArr = [
    '/env/development/15_集团权限管理服务.md',
    '/env/development/16_内容管理服务.md',
    '/env/development/17_会员管理服务.md',
    '/env/development/18_基础电商服务.md'
  ]

  return mapArr.map(i => {
    return i
  })
}

// 运维监控
function genOperationServiceSidebar() {
  const mapArr = [
    '/env/development/19_审计日志监控服务.md',
    '/env/development/20_异常报警监控服务.md'
  ]

  return mapArr.map(i => {
    return i
  })
}

/**
 * 解决方案
 * @param {场景类型} menus
 * @returns
 */
function genSolutionSidebar(menus) {
  if (menus == 0) {
    // 平台介绍
    const mapArr = [
      '/solution/' , 
      '/solution/26_企业数字中台整体方案.md',
    ]

    return mapArr.map(i => {
      return i
    })
  } else if (menus == 1) {
    // 平台介绍
    const mapArr = [
      '/solution/01_小型团队中台化方案.md',
      '/solution/02_中小团队研发自动化方案.md',
      '/solution/03_自动化运维监控方案.md',
      '/solution/04_中小型团队研发中台方案.md',
      '/solution/05_行业软件中台战略方案.md'
    ]

    return mapArr.map(i => {
      return i
    })
  } else if (menus == 2) {
    // 平台架构
    const mapArr = [
      // '06_团队数字化提升方案.md',
      //'/solution/07_企业一体化PaaS平台.md',
      //'/solution/08_微服务技术管理方案.md',
      //'/solution/09_企业统一身份认证管理方案.md',
      //'/solution/10_数据采集开发治理方案.md',
      //'/solution/16_大数据开放平台管理方案.md',
      //'/solution/11_传统业务中台化转型方案.md',
      //'/solution/12_轻量级数据治理方案.md',
      //'/solution/13_多业务综合管理方案.md'
      '18_SaaS平台解决方案.md',
      '19_技术中台解决方案.md',
      '20_企业数字化转型解决方案.md',
      '21_企业信息孤岛解决方案.md',
      '22_统一身份认证解决方案.md',
      '23_微服务技术解决方案.md',
      '09_传统业务升级中台解决方案.md',
      '24_业务中台解决方案.md',
      '25_云原生云平台解决方案.md',
      '26_中台系统建设解决方案.md'
    ]

    return mapArr.map(i => {
      return i
    })
  } else if (menus == 3) {
    // 项目规划
    const mapArr = [
      '/solution/14_电商物流管理解决方案.md',
      '/solution/15_政务集团统一认证.md',
      '/solution/17_传媒智能内容管理方案.md'
    ]

    return mapArr.map(i => {
      return i
    })
  }
}

/**
 * 商业授权
 * @param {场景类型} menus
 * @returns
 */
function genPricesSidebar(menus) {
  if (menus == 0) {
    // 平台介绍
    const mapArr = ['/prices/', '/prices/03_服务内容.md']

    return mapArr.map(i => {
      return i
    })
  } else if (menus == 1) {
    // 平台介绍
    const mapArr = ['/prices/01_版本内容.md', '/prices/02_授权协议.md']

    return mapArr.map(i => {
      return i
    })
  }
}

/**
 * 经验分享
 * @param {场景类型} menus
 * @returns
 */
function genExperienceSidebar(menus) {
  if (menus == 0) {
    const mapArr: string[] = ['/experience/']

    return mapArr.map(i => {
      return i
    })
  } else if (menus == 1) {
    const mapArr = [
      '/experience/01_经验目录.md',
      '/experience/02_沙龙活动计划.md'
    ]

    return mapArr.map(i => {
      return i
    })
  }
}
