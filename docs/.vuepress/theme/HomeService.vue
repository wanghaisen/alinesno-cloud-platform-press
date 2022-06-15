<template>
  <div class="layout layout-grid-0">
    <!--row -->
    <div class="grid-0">
      <!-- col -->

      <div class="col col-main">
        <div class="main-wrap J_Region wb-zc-ybmod-brand-mod2-pc">
          <!--module -->

          <div
            class="wb-zc-ybmod-brand-mod3-pc J_Module"
            tms="wb-zc-ybmod-brand-mod3-pc/0.0.3"
          >
            <div
              class="module-wrap J_tb_lazyload"
              data-spm-anchor-id="5176.7920199.709498.i0.4a4251f4wYpRyO"
              style="background-color: #373d41"
            >
              <div class="title" style="color: #fff; font-size: 24px">
                企业技术支持服务
              </div>
              <center class="des" style="color: #fff">
                提供全周期的技术支持服务，满足企业研发中台环境的搭建，包含部署指导，业务集成指导，二次开发指导还有过程答疑等，同步包括 业务整合，业务组开发使用指导，满足中小企业快速中台化，平台化的服务需求。
              </center>
              <ul class="col clearfix">

                <li class="colli" v-for="(item , index) in serviceArr" :key="index" >
                  <a target="_blank">
                    <div class="content">
                      <h3 class="item-title"> {{ item.name }} </h3>
                      <div class="item-img-panel">
                        <!-- <img :src="item.icon" class="item-img" /> -->
                        <i :class="item.icon"></i>
                      </div>
                      <p class="item-desc">
                        {{ item.desc }}
                      </p>
                    </div>
                  </a>
                </li>

              </ul>
            </div>
          </div>
          <!--module -->
        </div>
      </div>
      <!--col -->
    </div>
    <!-- row -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      serviceArr: [
        {
          name: '中台私服部署',
          icon: 'fas fa-shipping-fast',
          desc:
            '中小团队针对于中台快速技术中台，研发中台，为中小团队中台化和平台化提供部署和采购服务器指导'
        },
        {
          name: '技术咨询指导',
          icon: 'fas fa-file-signature',
          desc:
            '微服务整合指导，包括微服务集成，代码生成器使用和前端集成使用指导'
        },
        {
          name: '业务集成指导',
          icon: 'fas fa-laptop-code',
          desc:
            '中小团队针对于中台快速技术中台，研发中台，为中小团队中台化和平台化提供部署和采购服务器指导'
        },
        {
          name: '企业定制化开发',
          icon: 'fas fa-swatchbook',
          desc:
            '中小团队针对于中台快速技术中台，研发中台，为中小团队中台化和平台化提供部署和采购服务器指导'
        }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>

.wb-zc-ybmod-brand-mod3-pc J_Module{
  margin-top: 30px;
}

.wb-zc-ybmod-brand-mod2-pc .module-wrap {
  min-width: 1200px;
  background-color: #fff;
  padding-top: 28px;
  padding-bottom: 80px;
  float: left;
  width: 100%;
  margin-top: 0px ;
  padding-top: 20px;
  padding-bottom: 100px;

  .col {
    list-style: none;
    width: 1200px;
    margin: 0 auto;

    .colli {
      float: left;
      width: 210px;
      height: 354px;
      background-color: #314255;
      margin-right: 13px;
      border-radius: 2px;
      margin-left: 13px;
      // box-shadow: 1px 2px 10px 0px #000 ; 
      border-radius: 5px ;
      padding-bottom: 30px ;
      width: calc(25% - 26px);
      background-color: #1d2124;
      background-size: cover;

      a {
        display: block;
        width: 100%;
        height: 100%;
        text-decoration: none;

        .content {
          width: 100%;
          z-index: 10;
          padding: 0px;

          .item-title {
            font-size: 22px;
            color: #fff;
            line-height: 112px;
            text-align: center;
            font-weight: 700;
          }

          .item-img-panel {
            width: 55px;
            height: 55px;
            margin: 0 auto 32px;

            img {
              width: 55px;
              height: 55px;
            }
          }

          .item-desc {
            font-size: 14px;
            color: #fff;
            padding: 10px;
            line-height: 24px;
            text-align: center;
            transition: 0.3s all;
          }
        }
      }
    }
  }

  li:first-child {
    border-top: 0;
  }

  .title {
    text-align: center;
    font-size: 32px;
    color: #373D41;
    font-weight: 700;
    line-height: 120px;
  }

  .des {
    width: 1140px;
    margin: 0 auto 24px;
    font-size: 16px;
    color: #4a4a4a;
    line-height: 32px;
  }
}

.item-title {
  line-height: 82px ;
}

.item-img-panel {
    font-size: 3rem;
    text-align: center;
    color: #373d41;
    margin-top: -20px !important;
    padding-bottom: 20px !important ;
}

</style>
