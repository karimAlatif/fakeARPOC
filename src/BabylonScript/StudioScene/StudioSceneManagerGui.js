import * as BABYLON from 'babylonjs';
import * as BABYLONGUI from 'babylonjs-gui';

export const StudioSceneManagerGui = function (sceneManger) {

    this.SceneCanvas= BABYLONGUI.AdvancedDynamicTexture.CreateFullscreenUI("UI"); 
    this.studioSceneManager=sceneManger;

    //Canvas 
    this.conectedLine=null;


};
StudioSceneManagerGui.prototype = {

    SetupGui : function(){

        this.advancedTexture = BABYLONGUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.createRotationSlider();
     
        this.conectedLine = BABYLON.MeshBuilder.CreateLines("ConnectedLine", {
            points: [new BABYLON.Vector3.Zero(),new BABYLON.Vector3.Zero()],
            updatable:true,
        }, this.studioSceneManager.scene);
        this.conectedLine.isPickable=false;
        this.conectedLine.color=new BABYLON.Color3(0,1,0);

    },
    UpdateConnectedLinePos(mesh1Pos,mesh2Pos,color){
        let myPoints=[
            mesh1Pos,
            mesh2Pos,
        ]

        this.conectedLine =BABYLON.MeshBuilder.CreateLines("ConnectedLine", {
            points: myPoints,
            instance:this.conectedLine,
        }, this.studioSceneManager.scene);
        this.conectedLine.color =  (color) ? color : new BABYLON.Color3(0, 1, 0);

        this.conectedLine.isVisible=true;
    },
    createRotationSlider : function(){

        var UiPanel = new BABYLONGUI.StackPanel();
        UiPanel.width = "220px";
        UiPanel.fontSize = "14px";
        UiPanel.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        UiPanel.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.advancedTexture.addControl(UiPanel);

        this.SliderHeader = new BABYLONGUI.TextBlock();
        this.SliderHeader.text = "Y Axis" + ":" + 0;
        this.SliderHeader.height = "40px";
        this.SliderHeader.color = "green";
        this.SliderHeader.textHorizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.SliderHeader.paddingTop = "10px";
        UiPanel.addControl(this.SliderHeader); 

        this.RotationSlider = new BABYLONGUI.Slider();
        this.RotationSlider.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.RotationSlider.minimum = 0;
        this.RotationSlider.maximum = 2*Math.PI;
        this.RotationSlider.color = "green";
        this.RotationSlider.value = 0;
        this.RotationSlider.height = "20px";
        this.RotationSlider.width = "205px";
        UiPanel.addControl(this.RotationSlider); 
        this.RotationSlider.onValueChangedObservable.add((v)=>{
            if(!this.studioSceneManager.InputMg.currentSelectedMesh)
                return;
                this.studioSceneManager.InputMg.currentSelectedMesh.rotation.y = v;
                this.SliderHeader.text = "Y Axis" + ":" + (this.studioSceneManager.InputMg.currentSelectedMesh.rotation.y * (180/Math.PI)).toFixed(2);
                
            })
        this.SetSliderState(false,null);
    },
    SetSliderState : function(state,currentObj){
        this.RotationSlider.isVisible=state
        this.SliderHeader.isVisible=state

        if(!currentObj)
            return;
            this.RotationSlider.value = currentObj.rotation.y;
            this.SliderHeader.text = "Y Axis" + ":" + (currentObj.rotation.y * (180/Math.PI)).toFixed(2);
    }




}