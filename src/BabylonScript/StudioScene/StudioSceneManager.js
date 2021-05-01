import * as BABYLON from "babylonjs";
import * as BABYLONMaterials from "babylonjs-materials";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import "pepjs";
import "babylonjs-loaders";

import * as studioModules from "../StudioScene/StudioSceneModules";
import LoaderManager from "./LoaderManager";

export default class StudioSceneManager {
  constructor(game) {
    this.game = game;
    //Main Props
    this.scene = null;
    this.studioGui = null;
    this.mainCamera = null;
    this.pipline = null;

    //Input Manager
    this.InputMg = {
      isDragging: false,
      startPoint: null,
      currentTouchedMesh: null,
      currentSelectedMesh: null,
      MeshIndex: 0,
      dragLimitation: null,
      currentMeshDevOpts: null,
    };
    this.snapValue = 5.5;

    //Val's
    this.IsComponentTab = false;
  }

  //#region  MainSceneProperties
  CreateScene() {
    //Create Bts Scene
    //Create Scene
    this.scene = new BABYLON.Scene(this.game.engine);
    this.scene.clearColor = new BABYLON.Color4(
      48 / 255,
      48 / 255,
      48 / 255,
      1.0
    );
    this.scene.imageProcessingConfiguration.colorCurvesEnabled = true;
    this.scene.imageProcessingConfiguration.colorCurves = new BABYLON.ColorCurves();
    this.scene.imageProcessingConfiguration.colorCurves.globalSaturation = 0;
    this.scene.imageProcessingConfiguration.contrast = 2.5;
    this.scene.imageProcessingConfiguration.vignetteEnabled = true;

    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          console.log("POINTER DOWN");
          this.onPointerDown(pointerInfo.event);
          break;
        case BABYLON.PointerEventTypes.POINTERUP:
          console.log("POINTER UP");
          this.onPointerUp(pointerInfo.event);
          break;
        case BABYLON.PointerEventTypes.POINTERMOVE:
          this.onPointerMove(pointerInfo.event);
          break;
        case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
          if (this.InputMg.currentSelectedMesh) {
            //Item Selected Before
            this.InputMg.currentSelectedMesh.showBoundingBox = false;
          }
          break;
        case BABYLON.PointerEventTypes.POINTERWHEEL:
          this.MouseWheelHandler();
          break;
        default:
          break;
      }
    });

    //Installation
    this.createCamera();
    this.setUpEnvironMent();

    //Create LoadManager instance
    // this.loaderManager = new LoaderManager(this);
    // this.loaderManager.loadMainBike(); //start load mainBike

    // this.scene.debugLayer.show();
    // this.scene.getBoundingBoxRenderer().showBackLines = true;
    this.scene.getBoundingBoxRenderer().backColor = new BABYLON.Color3(
      254 / 255,
      153 / 255,
      52 / 255
    );
    this.scene.getBoundingBoxRenderer().frontColor = new BABYLON.Color3(
      254 / 255,
      153 / 255,
      52 / 255
    );

    return this.scene;
  }
  createCamera() {
    this.mainCamera = new BABYLON.DeviceOrientationCamera(
      "DevOr_camera",
      new BABYLON.Vector3(6.5, 5, -42),
      this.scene
    );
    this.mainCamera.checkCollisions = true;
    this.mainCamera.speed = 0.5;
    this.mainCamera.minZ = 0.5;
    this.mainCamera.fov = 1.3;

    this.mainCamera.attachControl(this.game.canvas, true);

    window.addEventListener("deviceorientation", null, true);

    // this.mainCamera = new BABYLON.ArcRotateCamera(
    //   "ArcCamera",
    //   306,
    //   63,
    //   60,
    //   new BABYLON.Vector3(0, 5.5, 0),
    //   this.scene
    // );
    // this.mainCamera.attachControl(this.game.canvas, true);
    // this.mainCamera.alpha = 5.45;
    // this.mainCamera.beta = 1.35;

    // this.mainCamera.lowerRadiusLimit = 23;
    // this.mainCamera.upperRadiusLimit = 70;

    // this.mainCamera.upperBetaLimit = 1.5;

    // this.mainCamera.minZ = 0.2;
    // this.mainCamera.wheelPrecision = 10;
    // this.mainCamera.useBouncingBehavior = true;
  }
  setUpEnvironMent() {
    let hemiLight = new BABYLON.HemisphericLight(
      "HemiLight",
      new BABYLON.Vector3(0.3, 1, -0.3),
      this.scene
    );
    hemiLight.intensity = 1;
    // hemiLight.groundColor =new BABYLON.Color3(62/255,62/255,62/255);
    // hemiLight.position = new BABYLON.Vector3(1, 50, -2);

    let dirLight = new BABYLON.DirectionalLight(
      "DirectionalLight",
      new BABYLON.Vector3(0.2, -1, -0.3),
      this.scene
    );
    dirLight.position = new BABYLON.Vector3(3, 9, 3);

    this.alphaMaterial = new BABYLON.StandardMaterial("alphaMat", this.scene);
    this.alphaMaterial.alpha = 0;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    // let ground = BABYLON.Mesh.CreateGround(
    //   "ground1",
    //   100,
    //   100,
    //   150,
    //   this.scene
    // );
    // ground.receiveShadows = true;

    var box2 = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, this.scene);
    box2.position.z = 5;
  }
  //#endregion

  //#region  StylesOpt's
  selectStyleFace(targetFaceType = null) {
    // targetFaceType = (targetFaceType) ? targetFaceType : studioModules.geFaceByAngle(this.mainCamera.alpha, this.currentStyleData.anglesRange) ;
    // let targetMesh = null;
    // switch (targetFaceType) {
    //     case studioModules.faceTypeEnum.frontFace:
    //         targetMesh= this.currentStyle.draggedSurfaces.frontWall;
    //         break;
    //     case studioModules.faceTypeEnum.backFace:
    //         targetMesh= this.currentStyle.draggedSurfaces.backWall;
    //         break;
    //     case studioModules.faceTypeEnum.leftFace:
    //         targetMesh= this.currentStyle.draggedSurfaces.leftWall;
    //         break;
    //     case studioModules.faceTypeEnum.rightFace:
    //         targetMesh= this.currentStyle.draggedSurfaces.rightWall;
    //         break;
    //     default:
    //         return;
    // };
    // // console.log("Trying to Updated!!!")
    // if( this.selectedFace && this.selectedFace.name === targetMesh.name) //if exists and the same
    //     return;
    // this.removeFaceHighLight_IfExists() //if exists and not the same
    // this.Highlighter.addMesh(targetMesh, new BABYLON.Color3(254/255, 153/255, 52/255)); //else not exists before
    // this.selectedFace = targetMesh;
  }
  removeFaceHighLight_IfExists() {
    if (this.selectedFace)
      //if exists and not the same
      this.Highlighter.removeMesh(this.selectedFace);
  }
  displayUiComponents() {
    if (
      this.camInit.radius === this.mainCamera.radius &&
      this.camInit.alpha === this.mainCamera.alpha &&
      this.camInit.beta === this.mainCamera.beta
    ) {
      //same
      // console.log("same");
      if (!this.Isexecuted) {
        // console.log("do it !!");
        this.handlers.onDrop(this.showComponentsIcons()); //display all components ui
        this.Isexecuted = true;
      }
    } else {
      //diff
      this.camInit.radius = this.mainCamera.radius;
      this.camInit.alpha = this.mainCamera.alpha;
      this.camInit.beta = this.mainCamera.beta;
      if (this.Isexecuted) {
        // console.log("don'ttttttt");
        this.handlers.onDrop(this.hideComponentsIcons()); //hide all components ui
      }
      this.Isexecuted = false;
      // console.log("difff");
    }
  }
  //#endregion

  //#region UserInput (Mouse)
  onPointerDown(ev) {
    console.log("Mouse Down");
    if (ev.button !== 0) {
      return;
    }

    if (this.InputMg.currentSelectedMesh) {
      //Item Selected Before
      this.InputMg.currentSelectedMesh.showBoundingBox = false;
    }
    //Pick Item To Move
    var pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY); //, function (mesh) { return mesh !=ground });
    if (
      pickInfo.hit &&
      pickInfo.pickedMesh.tag === "item" &&
      this.IsComponentTab
    ) {
      console.log(" */ ", pickInfo.pickedMesh.name, " */ ");
    }
  }
  onPointerUp(ev) {
    console.log("Up Mouse");
    if (this.InputMg.currentTouchedMesh) {
    }
  }
  onPointerMove(ev) {}
  MouseWheelHandler(ev) {}
  getGroundPosition(touchedMesh) {
    var pickinfo = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY,
      (mesh) => {
        return mesh === this.selectedFace;
      }
    );
    if (pickinfo.hit) {
      return pickinfo.pickedPoint;
    }
    // return this.VectorSnapping( pickinfo.pickedPoint);
    return null;
  }
  VectorSnapping(VtoSnap) {
    var sanpedVector = new BABYLON.Vector3.Zero();
    sanpedVector.x = this.round(VtoSnap.x);
    sanpedVector.y = 0;
    sanpedVector.z = this.round(VtoSnap.z);

    return sanpedVector;
  }
  round(input) {
    return this.snapValue * Math.round(input / this.snapValue);
  }
  //#endregion
}
