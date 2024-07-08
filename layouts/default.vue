<template>
    <div>
        <header id="page-topbar">
            <div class="items-center navbar-header d-flex">
                <div class="content__topBar">
                    <TopBar />
                </div>
            </div>
        </header>

        <div class="hide_nav_bar_btn z-10" :class="{ mini_active: toggleMini }" @click="toggleSidebar">
            <img loading="lazy" decoding="async" class="w-full right nodrag" src="~/assets/svgs/sidebar/right-chevron.svg" v-if="toggleMini" />
            <img loading="lazy" decoding="async" class="w-full left nodrag" src="~/assets/svgs/sidebar/left-chevron.svg" v-else />
        </div>

        <div class="vertical-menu">
            <div class="drawer__header" style="height: 100px">
                <div>
                    <img loading="lazy" decoding="async" class="w-full nodrag" src="../assets/images/Logo.png" />
                </div>
            </div>

            <simplebar class="h-100" ref="currentMenu" id="my-element">
                <div id="sidebar-menu" class="white">
                    <ul id="side-menu" class="metismenu">
                        <template v-for="item in routes" :key="item.key">
                            <li :class="item.route === path ? 'mm-active' : ''">
                                <a v-if="hasItems(item)" href="#" class="is-parent has-arrow">
                                    <span class="dl__drawer_list_icon" :style="`color: ${item?.color} !important`">
                                        <img loading="lazy" decoding="async" :src="images[item.key.toLowerCase()]" class="h-[18px]" />
                                    </span>
                                    <span class="item-title">{{ item.title }}</span>
                                    <img loading="lazy" decoding="async" v-if="item.children" src="~/assets/svgs/sidebar/new_theme_arrow.svg" class="mt-1 drop-arrow" />
                                </a>

                                <nuxt-link :to="item.route ?? ''" v-if="!hasItems(item)" class="side-nav-link-ref">
                                    <span class="dl__drawer_list_icon" :style="`color: ${item?.color} !important`">
                                        <img loading="lazy" decoding="async" :src="images[item.key.toLowerCase()]" class="h-[18px]" />
                                    </span>
                                    <span class="item-title">{{ item.title }}</span>

                                    <img loading="lazy" decoding="async" v-if="item.locked" src="~/assets/svgs/sidebar/lock.svg" class="h-[18px]" />
                                </nuxt-link>

                                <ul v-if="hasItems(item)" class="sub-menu" aria-expanded="false">
                                    <li v-for="(subitem, index) in item.children" :key="index" :class="subitem.route === path ? 'mm-active' : ''">
                                        <router-link :to="subitem.route" class="side-nav-link-ref">
                                            <div class="circle_div"></div>
                                            {{ subitem.name }}
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </ul>
                </div>
            </simplebar>
        </div>

        <div class="layout-wrapper">
            <div class="main-content">
                <div class="page-content overflow-hidden">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { items } from "~/composables/routes";
    import simplebar from "simplebar-vue";
    import MetisMenu from "metismenujs";

    definePageMeta({ middleware: ["auth", "permissions"], layoutTransition: true });

    const route = useRoute();
    const router = useRouter();

    const filename = (v) => {
        let final = v?.split("/");
        return final[final.length - 1]?.split(".")[0];
    };

    const glob = import.meta.glob("@/assets/svgs/sidebar/*.svg", { eager: true });
    const images = Object.fromEntries(
        Object.entries(glob).map(([key, value]) => [filename(key), value.default])
    );
    const toggleMini = ref(false);

    const routes = computed(() => {
        return items.value.filter(x => {

            const [read, write] = useNamedPermissions(x.key);

            if (read) {
                return true
            }
        })
    })

    const path = ref(window.location.pathname.split("/")[1]);

    const toggleSidebar = () => {
    document.body.classList.toggle("sidebar-enable");

    if (window.screen.width >= 900) {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
        document.body.classList.remove("sidebar-enable");
        document.body.classList.remove("vertical-collpsed");
        });
        document.body.classList.toggle("vertical-collpsed");
    } else {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
        document.body.classList.remove("sidebar-enable");
        });
        document.body.classList.remove("vertical-collpsed");
    }
    toggleMini.value = !toggleMini.value;
    };

    const hasItems = (item) => {
    return item.children !== undefined ? item.children.length > 0 : false;
    };

    const onRoutechange = () => {
    const hideNavBtn = document.querySelector('.hide_nav_bar_btn')
    if (window.screen.width < 900) {
        hideNavBtn?.classList.add('mini_active')
        toggleMini.value = true;
    }
    setTimeout(() => {
        if (document.getElementsByClassName("mm-active").length > 0) {
        const currentPosition =
            document.getElementsByClassName("mm-active")[0].offsetTop;
        if (currentPosition > 500)
            document.getElementsByClassName("mm-active")[0].scrollTop =
            currentPosition + 300;
        }
    }, 300);
    };

    const activateMenu = (oldVal = null) => {
    // clear the previous activated menus
    if (oldVal) {
        var matchingMenuItem = null;
        const paths = [];
        var links = document.getElementsByClassName("side-nav-link-ref");
        for (var i = 0; i < links.length; i++) {
        paths.push(links[i]["pathname"]);
        }
        var itemIndex = paths.indexOf('/' + oldVal.split('/')[1]);
        if (itemIndex === -1) {
        const strIndex = window.location.pathname.lastIndexOf("/");
        const item = window.location.pathname.substr(0, strIndex).toString();
        matchingMenuItem = links[paths.indexOf(item)];
        } else {
        matchingMenuItem = links[itemIndex];
        }
        if (matchingMenuItem) {
        matchingMenuItem.classList.remove("mm-active");
        var parent = matchingMenuItem.parentElement;
        if (parent) {
            parent.classList.remove("mm-active");
            const parent2 = parent.parentElement.closest("ul");
            if (parent2 && parent2.id !== "side-menu") {
            parent2.classList.remove("mm-show");
            parent2.classList.remove("mm-active");
            const parent3 = parent2.parentElement;
            if (parent3) {
                parent3.classList.remove("mm-active");
            }
            }
        }
        }
    }

    // get the current activated menu
    var links = document.getElementsByClassName("side-nav-link-ref");
    var matchingMenuItem = null;
    const paths = [];

    for (var i = 0; i < links.length; i++) {
        paths.push(links[i]["pathname"]);
    }

    const newPath = window.location.pathname.split("/")[1];
    path.value = newPath;

    var itemIndex = paths.indexOf('/' + newPath);
    if (itemIndex === -1) {
        const strIndex = window.location.pathname.lastIndexOf("/");
        const item = window.location.pathname.substr(0, strIndex).toString();
        matchingMenuItem = links[paths.indexOf(item)];
    } else {
        matchingMenuItem = links[itemIndex];
    }
    if (matchingMenuItem) {
        matchingMenuItem.classList.add("mm-active");
        var parent = matchingMenuItem.parentElement;

        if (parent) {
        parent.classList.add("mm-active");
        const parent2 = parent.parentElement.closest("ul");
        if (parent2 && parent2.id !== "side-menu") {
            parent2.classList.add("mm-show");
            parent2.classList.add("mm-active");

            const parent3 = parent2.parentElement;
            if (parent3) {
            parent3.classList.add("mm-active");
            }
        }
        }
    }

    onRoutechange();
    };

/**
 * watch
 */
    watch(
        () => route.path,
        (val, oldVal) => {
            activateMenu(oldVal);
        },
        { immediate: true, deep: true }
    );
/**
 * watch
 */

/**
 * end methods
 */

    onMounted(() => {
    // eslint-disable-next-line no-unused-vars
    let menuRef = new MetisMenu("#side-menu");
    setTimeout(() => {
        activateMenu();
    }, 500);
    });
</script>

<style lang="scss" scoped>
// a[aria-current='page']::before {
//   view-transition-name: in;
// }

// ------------------------------------------------------------------------
/**
* Variables
*/

$primary: #4263EB !important;

$sidebar-bg: #ffffff;
$sidebar-menu-item-color: #000000de;
$sidebar-menu-sub-item-color: #000000de;
$sidebar-menu-item-hover-color: #000000de;
$sidebar-menu-item-hover-bg-color: #4263eb1a;
$sidebar-menu-item-active-color: #000000de;
$sidebar-menu-item-active-bg-color: #4263eb1a;
$sidebar-menu-sub-item-active-color: #ffffff;
$sidebar-menu-sub-item-active-bg-color: #4263eb;
$sidebar-width: 220px;
$sidebar-collapsed-width: 0px;
$sidebar-width-sm: 160px;

$header-height: 60px;
$header-item-color: #555b6d;
$header-bg: #ffffff;

$grid-gutter-width: 24px;
$box-shadow: 0 0.75rem 1.5rem rgba(18, 38, 63, 0.03);

/**
  * Utilities
  */

.list-unstyled {
  padding-left: 0;
  list-style: none;
}

.h-100 {
  height: 100%;
}

//
// header
//

#page-topbar {
  position: fixed;
  top: 0;
  right: 0;
  // left: $sidebar-width;
  z-index: 5;
  background-color: #ffffff;
  transition: all 0.35s;
  -moz-transition: all 0.35s;
  -webkit-transition: all 0.35s;
  border-bottom: 3px solid #eee;
}

.drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
}

.navbar-header {
  margin: 0 auto;
  height: $header-height;
  // display: flex;

  .dl__header {
    padding: 12px 20px;
  }
}

.page-content {
  padding: $header-height 0 0;
  height: 100%;
}

//
// side_menu
//

.layout-wrapper {
  max-width: 100%;
  min-height: 100vh;
}

.metismenu {
  margin: 0;
  padding-left: 0 !important;

  li {
    display: block;
    width: 100%;
  }

  .mm-collapse {
    display: none;

    &:not(.mm-show) {
      display: none;
    }

    &.mm-show {
      display: block;
    }
  }

  .mm-collapsing {
    position: relative;
    height: 0;
    overflow: hidden;
    transition-timing-function: ease;
    transition-duration: 0.35s;
    transition-property: height, visibility;
  }
}

.vertical-menu {
  width: $sidebar-width;
  z-index: 1002;
  background: $sidebar-bg;
  top: 0;
  bottom: 0;
  margin-top: 0;
  position: fixed;
  // padding-top: $header-height;
  border-right: 3px solid #eee;
  transition: all 0.35s;
  -moz-transition: all 0.35s;
  -webkit-transition: all 0.35s;
}

.main-content {
  margin-left: $sidebar-width;
  height: 100vh;
  overflow-y: auto;
  background-color: #F4F5F6;
  transition: all 0.35s;
  -moz-transition: all 0.35s;
  -webkit-transition: all 0.35s;

  .content {
    // padding: 0 6px 6px 6px;
    // margin-top: $header-height;
  }
}

#sidebar-menu {
  padding: 10px;

  .mm-active {
    >.has-arrow {
      .drop-arrow {
        transform: rotate(90deg);
      }
    }
  }

  .has-arrow {
    vertical-align: middle;

    .drop-arrow {
      display: block;
      float: right;
      transition: transform 0.2s;
      font-size: 12px;
      margin-right: 0.5rem;
    }
  }

  ul {
    li {
      margin-bottom: 0.25rem;
      font-family: Figtree;

      a {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 12px;
        color: $sidebar-menu-item-color;
        position: relative;
        font-size: 14px;
        transition: all 0.35s;
        text-decoration: none !important;
        border-radius: 8px;
        width: 100%;

        .item-title {
          font-size: inherit !important;
          font-weight: inherit !important;
          flex-grow: 1 !important;
        }

        .dl__drawer_list_icon {
          display: inline-block;
          min-width: 1.75rem;
          // padding-bottom: .125em;
          font-size: 14pxrem;
          line-height: 1.40625rem;
          vertical-align: middle;
          transition: all 0.35s;
        }

        &:hover {
          color: $sidebar-menu-item-hover-color;
          background-color: $sidebar-menu-item-hover-bg-color;
        }
      }

      ul.sub-menu {
        padding: 4px 0 !important;

        li {
          display: flex;
          align-items: center;
          padding: 0 !important;
          border-radius: 8px;

          a {
            font-size: 12px;
            color: $sidebar-menu-sub-item-color;
            flex-grow: 1;
            padding: 8px 0.5rem 8px 2.5rem !important;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .circle_div {
              width: 6px;
              height: 6px;
              border-radius: 50px;
              background: #000;
              margin-right: 1rem;
            }
          }

          &:hover {
            background-color: $sidebar-menu-item-hover-bg-color;

            a {
              color: $sidebar-menu-item-hover-color;
              background-color: transparent !important;
            }
          }
        }
      }
    }
  }
}

.mm-active {
  color: $sidebar-menu-item-active-color !important;

  >a {
    color: $sidebar-menu-item-active-color !important;
    background-color: $sidebar-menu-item-active-bg-color;
    font-weight: 600;
    border-radius: 8px;
  }

  .active {
    color: $sidebar-menu-item-active-color !important;
  }

  ul {
    li.mm-active {
      background-color: $sidebar-menu-sub-item-active-bg-color !important;
      border-radius: 4px;

      a {
        color: $sidebar-menu-sub-item-active-color !important;
        background-color: transparent !important;

        .circle_div {
          background: $sidebar-menu-sub-item-active-color !important;
        }
      }
    }
  }
}

@media (max-width: 900px) {
  .vertical-menu {
    display: none;
  }

  .main-content {
    margin-left: 0 !important;
  }

  body.sidebar-enable {
    .vertical-menu {
      display: block;
    }
  }
}

// Enlarge menu
.vertical-collpsed {
  .main-content {
    margin-left: $sidebar-collapsed-width;
  }

  #page-topbar {
    left: $sidebar-collapsed-width;
  }

  // Side menu
  .vertical-menu {
    // position: absolute;
    width: $sidebar-collapsed-width !important;
    z-index: 5;

    .simplebar-mask,
    .simplebar-content-wrapper {
      overflow: visible !important;
    }

    .simplebar-scrollbar {
      display: none !important;
    }

    .simplebar-offset {
      bottom: 0 !important;
    }

    // Sidebar Menu
    #sidebar-menu {

      .menu-title,
      .collapse.in {
        display: none !important;
      }

      .nav.collapse {
        height: inherit !important;
      }

      .has-arrow {
        .drop-arrow {
          display: none;
        }
      }

      >ul {
        >li {
          position: relative;
          white-space: nowrap;

          >a {
            padding: 12px;
            // min-height: 55px;
            transition: none;

            &:hover,
            &:active,
            &:focus {
              color: $sidebar-menu-item-hover-color;
            }

            .item-title {
              display: none;
              padding-left: 25px;
            }
          }

          &:hover {
            >a {
              position: relative;
              width: calc(190px + #{$sidebar-collapsed-width});
              color: $primary;
              background-color: darken($sidebar-bg, 4%);
              transition: none;

              i {
                color: $primary;
              }

              .item-title {
                display: inline;
              }
            }

            >ul {
              display: block;
              left: $sidebar-collapsed-width;
              position: absolute;
              width: 190px;
              height: auto !important;
              box-shadow: 3px 5px 10px 0 rgba(54, 61, 71, 0.1);

              ul {
                box-shadow: 3px 5px 10px 0 rgba(54, 61, 71, 0.1);
              }

              a {
                box-shadow: none;
                padding: 8px 20px;
                position: relative;
                width: 190px;
                z-index: 6;
                color: $sidebar-menu-sub-item-color;

                &:hover {
                  color: $sidebar-menu-item-hover-color;
                }
              }
            }
          }
        }

        ul {
          padding: 5px 0;
          z-index: 9990;
          display: none;
          background-color: $sidebar-bg;

          li {
            &:hover {
              >ul {
                display: block;
                left: 190px;
                height: auto !important;
                margin-top: -36px;
                position: absolute;
                width: 190px;
              }
            }

            >a {
              .item-title.pull-right {
                position: absolute;
                right: 20px;
                top: 12px;
                transform: rotate(270deg);
              }
            }
          }

          li.active {
            a {
              color: #f8f9fa;
            }
          }
        }
      }
    }
  }
}

.hide_nav_bar_btn {
  position: absolute;
  top: 50%;
  left: $sidebar-width;
  transform: translateY(-50%);
  z-index: 100;
  background: #4263eb1a;
  border-radius: 0 4px 4px 0 !important;
  height: 60px;
  width: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition-timing-function: ease;
  transition-duration: 0.35s;
  transition-property: height, visibility;
  opacity: 1;

  .left {
    filter: invert(33%) sepia(92%) saturate(7482%) hue-rotate(204deg) brightness(99%) contrast(101%);
  }

  &:hover {
    background: #4263eb;

    .left {
      filter: brightness(0) invert(1);
    }
  }

  svg {
    color: #4263eb;
  }

  &.mini_active {
    left: 0px;
    background: #4263eb;
    color: #fff;
    z-index: 3;

    svg {
      color: #fff;
    }
  }
}

/**
 * scrollbar
 */
[data-simplebar] {
  position: relative;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;
}

.simplebar-wrapper {
  overflow: hidden;
  width: inherit;
  height: inherit;
  max-width: inherit;
  max-height: inherit;
}

.simplebar-mask {
  direction: inherit;
  position: absolute;
  overflow: hidden;
  padding: 0;
  margin: 0;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: auto !important;
  height: auto !important;
  z-index: 0;
}

.simplebar-offset {
  direction: inherit !important;
  box-sizing: inherit !important;
  resize: none !important;
  position: absolute;
  top: 0;
  left: 0 !important;
  bottom: 0;
  right: 0 !important;
  padding: 0;
  margin: 0;
  -webkit-overflow-scrolling: touch;
}

.simplebar-content-wrapper {
  direction: inherit;
  box-sizing: border-box !important;
  position: relative;
  display: block;
  height: 100%;
  /* Required for horizontal native scrollbar to not appear if parent is taller than natural height */
  width: auto;
  visibility: visible;
  overflow: auto;
  /* Scroll on this element otherwise element can't have a padding applied properly */
  max-width: 100%;
  /* Not required for horizontal scroll to trigger */
  max-height: 100%;
  /* Needed for vertical scroll to trigger */
  scrollbar-width: none;
  padding: 0px !important;
}

.simplebar-content-wrapper::-webkit-scrollbar,
.simplebar-hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.simplebar-content:before,
.simplebar-content:after {
  content: " ";
  display: table;
}

.simplebar-placeholder {
  max-height: 100%;
  max-width: 100%;
  width: 100%;
  pointer-events: none;
}

.simplebar-height-auto-observer-wrapper {
  box-sizing: inherit !important;
  height: 100%;
  width: 100%;
  max-width: 1px;
  position: relative;
  float: left;
  max-height: 1px;
  overflow: hidden;
  z-index: -1;
  padding: 0;
  margin: 0;
  pointer-events: none;
  flex-grow: inherit;
  flex-shrink: 0;
  flex-basis: 0;
}

.simplebar-height-auto-observer {
  box-sizing: inherit;
  display: block;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 1000%;
  width: 1000%;
  min-height: 1px;
  min-width: 1px;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.simplebar-track {
  z-index: 1;
  position: absolute;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

[data-simplebar].simplebar-dragging .simplebar-content {
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

[data-simplebar].simplebar-dragging .simplebar-track {
  pointer-events: all;
}

.simplebar-scrollbar {
  position: absolute;
  right: 2px;
  width: 4px;
  min-height: 10px;
}

.simplebar-scrollbar:before {
  position: absolute;
  content: "";
  background: #a2adb7;
  border-radius: 7px;
  left: 0;
  right: 0;
  opacity: 0;
  transition: opacity 0.2s linear;
}

.simplebar-scrollbar.simplebar-visible:before {
  /* When hovered, remove all transitions from drag handle */
  opacity: 0.5;
  transition: opacity 0s linear;
}

.simplebar-track.simplebar-vertical {
  top: 0;
  width: 11px;
}

.simplebar-track.simplebar-vertical .simplebar-scrollbar:before {
  top: 2px;
  bottom: 2px;
}

.simplebar-track.simplebar-horizontal {
  left: 0;
  height: 11px;
}

.simplebar-track.simplebar-horizontal .simplebar-scrollbar:before {
  height: 100%;
  left: 2px;
  right: 2px;
}

.simplebar-track.simplebar-horizontal .simplebar-scrollbar {
  right: auto;
  left: 0;
  top: 2px;
  height: 7px;
  min-height: 0;
  min-width: 10px;
  width: auto;
}

/* Rtl support */
[data-simplebar-direction="rtl"] .simplebar-track.simplebar-vertical {
  right: auto;
  left: 0;
}

.hs-dummy-scrollbar-size {
  direction: rtl;
  position: fixed;
  opacity: 0;
  visibility: hidden;
  height: 500px;
  width: 500px;
  overflow-y: hidden;
  overflow-x: scroll;
}

.simplebar-hide-scrollbar {
  position: fixed;
  left: 0;
  visibility: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
}

.custom-scroll {
  height: 100%;
}
</style>

<style>
.main__wrap {
  display: grid;
  grid-template-columns: 15rem 1fr;
  width: 100vw;
  height: 100vh;
}

.content__overflow_wrapper {
  overflow-y: auto;
  max-height: calc(100vh - 55px);
  min-width: 100%;
  background: #f4f5f6;
  border-radius: 7px;
}

.content__topBar {
  position: sticky;
  min-height: 55px;
  max-height: 55px;
  top: 0;
}
</style>
