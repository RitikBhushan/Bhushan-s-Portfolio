import Experience from "../Experience";
import * as THREE from "three";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };
    this.onMouseMove();
    this.setAnimation();
    this.setModel();
  }
  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }
      if (child.name === "Screen") {
        child.material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }
    });

    const width = 0.5;
    const height = 0.7;
    const intensity = 1;
    const rectLight = new THREE.RectAreaLight(
      0xffffff,
      intensity,
      width,
      height
    );
    rectLight.position.set(9.8244 , 7, -2.810353 );
    this.actualRoom.add(rectLight);
    rectLight.rotation.x= -Math.PI/2;
    rectLight.rotation.z= Math.PI/4;

    // ===============

    const width1 = 0.1;
    const height1 = 0.1;
    const intensity1 = 5;
    const rectLight1 = new THREE.RectAreaLight(
      0xffffff,
      intensity1,
      width1,
      height1
    );


    rectLight1.position.set(1.500244 , 9, -5.810353 );
    this.actualRoom.add(rectLight1);
    rectLight1.rotation.x= -Math.PI/2;
    rectLight1.rotation.z= Math.PI/4;

  

    // const rectLightHelper = new RectAreaLightHelper(rectLight1);
    // rectLight1.add(rectLightHelper);

    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.11, 0.11, 0.11);
  }
  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    this.swim = this.mixer.clipAction(this.room.animations[0]);
    this.swim.play();
  }
  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation =
        ((e.clientX - window.innerHeight / 2) * 2) / window.innerHeight;
      this.lerp.target = this.rotation * 0.1;
    });
  }

  resize() {}
  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.actualRoom.rotation.y = this.lerp.current;

    this.mixer.update(this.time.delta * 0.0009);
  }
}
