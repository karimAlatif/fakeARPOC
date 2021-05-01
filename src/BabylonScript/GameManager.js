import * as BABYLON from 'babylonjs';
import 'babylonjs-materials';

import  StudioSceneManager  from './StudioScene/StudioSceneManager';

export  class GameManger {

    constructor(canvas,engine) {
        //Define Canvas
        this.canvas= canvas ;
         
        //Define Engine
        this.engine=engine;
        this.engine.enableOfflineSupport=true;
    
        //Create StudioScene Instacne (StudioScene Manager)
        this.studioSceneManager= new StudioSceneManager(this);
    
        //Create scene
        this.currentScene = this.studioSceneManager.CreateScene();
        
        // The render function
        this.engine.runRenderLoop(
            ()=> {
            this.currentScene.render();
        });
    
        // Resize the babylon engine when the window is resized
        window.addEventListener("resize",  ()=> {
            console.log(" resize From GameManager Babylon", this)
            this.engine.resize();
        },false);
    }

};
