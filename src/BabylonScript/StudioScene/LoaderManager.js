import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';


export default class LoaderManager {
    constructor(sceneManager) {
        this.game = sceneManager.game;
        this.scene = sceneManager.scene;
        this.mirror = sceneManager.mirror;
        this.shadowGenerator = sceneManager.shadowGenerator;

        this.bikeMesh = null;
    }

    loadMainBike () { //Create Bts Scene

        let assetsManager = new BABYLON.AssetsManager(this.scene);
        let bike_task = assetsManager.addMeshTask("btcShelter_task", "", "./models/Rev_3/", "HP_4_Rev_3.glb");
    
        bike_task.onSuccess = (task) => { //Test --On Mesh Success

            this.bikeMesh = task.loadedMeshes[0]; //_root_
            this.bikeMesh.position.x += 8;
            this.bikeMesh.scaling = new BABYLON.Vector3(10, 10, -10)

            for (let j = 0; j < task.loadedMeshes.length; j++) {
                let mesh = task.loadedMeshes[j];
                if (mesh.getTotalVertices() > 0) { //if it's mesh
                    this.mirror.renderList.push(mesh);
                    this.shadowGenerator.getShadowMap().renderList.push(mesh);
                    this.shadowGenerator.addShadowCaster(mesh,true);    

                    let tires = this.scene.getMaterialByName("Tires");
                        tires.sheen.isEnabled=true;
                        tires.sheen.intensity=.5;

                    let wheels = this.scene.getMaterialByName("Bike_wheels");
                        wheels.sheen.isEnabled=true;
                        wheels.sheen.intensity=1;

                    let body = this.scene.getMaterialByName("Bike_main");
                        body.sheen.isEnabled=true;
                        body.sheen.intensity=.2;
                        body.metallic=0.70;
                        body.roughness=0.60;
                
                    
                }
                console.log(task.loadedMeshes[j].name, "   ", j);
            }
        }
        
        
        assetsManager.onProgress = (remainingCount, totalCount, lastFinishedTask) => {
            this.game.engine.loadingUIText = 'loading Assets ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
        };
          
        assetsManager.onFinish = (tasks) => { //On ALL Done
            // console.log(" tasks ", tasks);
            // for (let i = 0; i < tasks.length; i++) {
            //     for (let j = 0; j < tasks[i].loadedMeshes.length; j++) {
            //         console.log(tasks[i].loadedMeshes[j].name, "   ", j);
            //     }
            // }
        };
        // Start loading
        assetsManager.load();
    }
}

// for (let j = 0; j < task.loadedMeshes.length; j++) {
//     console.log(task.loadedMeshes[j].name, "   ", j);
// }