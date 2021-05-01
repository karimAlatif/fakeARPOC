//Libs
import React, { createRef, createContext } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Typography, Spin, Layout, Menu, Button } from "antd";

//Components
import GameManager from "../GameManager";

//
const { Header } = Layout;
const { Title } = Typography;

const gmRef = createRef(null);
export const GmContext = createContext(null);

//
export default class Scene extends React.Component {
  state = {
    selectedStyle: null,
  };

  studioSceneHandlers = {
    onSelect: (params) => {},
    onDrag: () => {
      console.log("Ui Drag Action !!");
    },
    onDrop: (faceCompsData) => {
      console.log("Ui Drop Action !!", faceCompsData);

      let tmpVisibleArr = [];
      for (let i = 0; i < faceCompsData.length; i++) {
        tmpVisibleArr.push(faceCompsData[i].isSelected);
      }

      this.setState({
        selectedFaceComps: faceCompsData,
        visibleArr: tmpVisibleArr,
      });
    },
    onDeselect: () => {},
  };

  componentWillMount() {
    this.setState(
      {
        selectedStyle: {}, //get FirstStyle
      },
      () => {}
    );
  }

  componentDidMount() {
    const GManger = GameManager(gmRef.current).GManger; //Create Babylonjs Ref
    GManger.studioSceneManager.handlers = this.studioSceneHandlers; //Hnadlers
    this.setState(
      {
        GManger,
      },
      () => {
        console.log(" GManger Ened ! ", this.state.GManger);
      }
    );
    console.log("p will");
  }

  //HandleStyleComponents
  handleStyleComponents = () => {
    this.setState({}, () => {});
  };

  //#region EditorButtons Helpers
  visibleChange = (visible, index) => {
    const { visibleArr } = this.state;

    let tmpVisibleArr = [...visibleArr];
    tmpVisibleArr[index] = visible;

    this.setState({
      visibleArr: tmpVisibleArr,
    });
  };
  //#endregion

  //#region EmailForm
  onEmailDataSubmit = (formData) => {
    const {} = formData;
    console.log("oo  formData ", formData);
    this.setState(
      {
        isEmailModalOpen: false,
      },
      () => {
        console.log("After State");
      }
    );
  };
  handleEmailModalState = (state) => {
    this.setState({
      isEmailModalOpen: state,
    });
  };
  //#endregion SubmitForm

  render() {
    let opts = {};
    const {
      GManger,
      selectedStyle,
      isZipModelOpen,
      selectedFaceComps,
      visibleArr,
      isEmailModalOpen,
    } = this.state;
    return (
      <GmContext.Provider value={GManger}>
        <canvas {...opts} className="canvas" ref={gmRef} />
      </GmContext.Provider>
    );
  }
}
