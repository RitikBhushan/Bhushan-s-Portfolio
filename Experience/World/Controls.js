import Experience from "../Experience";
import * as THREE from "three";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from '@ashthornton/asscroll'
export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room.actualRoom;
    this.room.children.forEach((child) => {
      if (child.type === "ReactAreaLight") {
        this.rectLight = child;
      }
    });
    GSAP.registerPlugin(ScrollTrigger);

    this.setSmoothScroll();
    this.setScrollTrigger();
  }

  setupASScroll() {
    // https://github.com/ashthornton/asscroll
    //References
    const asscroll = new ASScroll({
        ease: 0.1,
        disableRaf: true,
    });

    GSAP.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
        scroller: asscroll.containerElement,
    });
    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
        scrollTop(value) {
            if (arguments.length) {
                asscroll.currentPos = value;
                return;
            }
            return asscroll.currentPos;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        fixedMarkers: true,
    });

    asscroll.on("update", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", asscroll.resize);

    requestAnimationFrame(() => {
        asscroll.enable({
            newScrollElements: document.querySelectorAll(
                ".gsap-marker-start, .gsap-marker-end, [asscroll]"
            ),
        });
    });
    return asscroll;
  }

  setSmoothScroll(){
    this.asscroll= this.setupASScroll();
  }
  setScrollTrigger() {
    ScrollTrigger.matchMedia({
      //Desktop
      "(min-width: 969px)": () => {
        console.log("fired desktop");

        this.room.scale.set(0.11, 0.11, 0.11);
                // this.rectLight.width = 0.5;
                // this.rectLight.height = 0.7;
                // this.camera.orthographicCamera.position.set(0, 6.5, 10);
                // this.room.position.set(0, 0, 0);

        // First section -----------------------------------------
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
              trigger: ".first-move",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              // markers: true,
              invalidateOnRefresh: true,
          },
      });
      this.firstMoveTimeline.fromTo(
          this.room.position,
          { x: 0, y: 0, z: 0 },
          {
              x: () => {
                  return this.sizes.width * 0.0014;
              },
          }
      );

        //second section

        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        this.secondMoveTimeline.to(
          this.room.position,
          {
            x: () => {
              return 1;
            },
            z: () => {
              return this.sizes.height * 0.0032;
            },
          },
          "same"
        );
        this.secondMoveTimeline.to(
          this.room.scale,
          {
            x: 0.4,
            y: 0.4,
            z: 0.4,
          },
          "same"
        );
        this.secondMoveTimeline.to(
          this.rectLight,
          {
            width: 0.5 * 4,
            height: 0.7 * 4,
          },
          "same"
        );

        // -------------third section----------------

        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(this.camera.orthographicCamera.position, {
          x:1,
          z:2,
          y: 6.5,
        });

        // -------------forth----------------

        this.forthMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
              trigger: ".forth-move",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              // markers: true,
              invalidateOnRefresh: true,
          },
      });
      this.forthMoveTimeline.fromTo(
          this.room.position,
          { x: 0, y: 0, z: 0 },
          {
              x: () => {
                  return this.sizes.width * 0.0019;
              },
              y: () => {
                return this.sizes.width * 0.0059;
            },
            z: () => {
              return this.sizes.width * 0.0004;
          },
              
          }
      );
      //--------fifth section-----------
      },

      
      //Mobile
      "(max-width: 968px)": () => {
        // console.log("fired mobile");

        // Resets
        this.room.scale.set(0.07, 0.07, 0.07);
        this.room.position.set(0, 0, 0);
        // this.rectLight.width = 0.3;
        // this.rectLight.height = 0.4;
        // this.camera.orthographicCamera.position.set(0, 6.5, 10);

        // First section -----------------------------------------
        this.firstMoveTimeline = new GSAP.timeline({
            scrollTrigger: {
                trigger: ".first-move",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
                // invalidateOnRefresh: true,
            },
        }).to(this.room.scale, {
            x: 0.1,
            y: 0.1,
            z: 0.1,
        });

        // Second section -----------------------------------------
        this.secondMoveTimeline = new GSAP.timeline({
            scrollTrigger: {
                trigger: ".second-move",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
                invalidateOnRefresh: true,
            },
        })
            .to(
                this.room.scale,
                {
                    x: 0.25,
                    y: 0.25,
                    z: 0.25,
                },
                "same"
            )
            .to(
                this.rectLight,
                {
                    width: 0.3 * 3.4,
                    height: 0.4 * 3.4,
                },
                "same"
            )
            .to(
                this.room.position,
                {
                    x: 1.5,
                },
                "same"
            );

        // Third section -----------------------------------------
        this.thirdMoveTimeline = new GSAP.timeline({
            scrollTrigger: {
                trigger: ".third-move",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
                invalidateOnRefresh: true,
            },
        }).to(this.room.position, {
            z: -4.5,
        });
    },   
    });
  }

  resize() {}
  update() {}
}
