import React from 'react';

export class Line extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showColorPicker: false,
      nameChanging: false,
      lineId: null,
      collapsed: false
    };

    this.defaultLines = [
      {
        'name': 'Red Line',
        'color': '#e6194b'
      },
      {
        'name': 'Green Line',
        'color': '#3cb44b'
      },
      {
        'name': 'Yellow Line',
        'color': '#ffe119'
      },
      {
        'name': 'Blue Line',
        'color': '#4363d8'
      },
      {
        'name': 'Orange Line',
        'color': '#f58231'
      },
      {
        'name': 'Purple Line',
        'color': '#911eb4'
      },
      {
        'name': 'Cyan Line',
        'color': '#42d4f4'
      },
      {
        'name': 'Magenta Line',
        'color': '#f032e6'
      },
      {
        'name': 'Lime Line',
        'color': '#bfef45'
      },
      {
        'name': 'Pink Line',
        'color': '#fabebe'
      },
      {
        'name': 'Teal Line',
        'color': '#469990'
      },
      {
        'name': 'Lavender Line',
        'color': '#e6beff'
      },
      {
        'name': 'Brown Line',
        'color': '#9A6324'
      },
      {
        'name': 'Beige Line',
        'color': '#fffac8'
      },
      {
        'name': 'Maroon Line',
        'color': '#800000'
      },
      {
        'name': 'Mint Line',
        'color': '#aaffc3'
      },
      {
        'name': 'Olive Line',
        'color': '#808000'
      },
      {
        'name': 'Apricot Line',
        'color': '#ffd8b1'
      },
      {
        'name': 'Navy Line',
        'color': '#000075'
      },
      {
        'name': 'Grey Line',
        'color': '#a9a9a9'
      }
    ];
  }

  handleExCol() {
    this.setState({
      collapsed: this.state.collapsed ? false : true
    });
  }

  handleNameChange(value) {
    this.setState({
      name: value,
      nameChanging: true
    });
  }

  handleNameBlur(value) {
    let line = this.props.line;
    if (line.name !== value) {
      line.name = value;
      this.props.onLineInfoChange(line);
    }
    this.setState({
      name: '',
      nameChanging: false
    });
  }

  handleColorCancel() {
    this.setState({
      showColorPicker: false
    });
  }

  handleColorChange() {
    if (this.props.viewOnly) {
      return;
    }
    this.setState({
      showColorPicker: true
    });
  }

  handleColorSelect(chosen) {
    let line = this.props.line;
    const defNames = this.defaultLines.map(d => d.name);
    if (!defNames.includes(line.name)) {
      line.color = chosen.color;
    } else {
      line.color = chosen.color;
      line.name = chosen.name;
    }
    this.props.onLineInfoChange(line, true);
    this.setState({
      showColorPicker: false
    })
  }

  renderColorOptions() {
    let options = [];
    for (const defLine of this.defaultLines) {
      options.push(
        <button className="Line-color" key={defLine.color} title={defLine.name}
                style={{backgroundColor: defLine.color}}
                onClick={() => this.handleColorSelect(defLine)}>
        </button>
      );
    }
    return options;
  }

  renderTransfers(stationId) {
    const system = this.props.system;
    const line = this.props.line;

    let transfers = [];
    for (const lineKey in (system.lines || {})) {
      if (lineKey !== line.id && system.lines[lineKey].stationIds.includes(stationId)) {
        transfers.push(
          <div className="Line-transfer" key={lineKey}>
            <div className="Line-transferPrev" style={{backgroundColor: system.lines[lineKey].color}}></div>
          </div>
        );
      }
    }

    if (!transfers.length) {
      return;
    } else {
      return (
        <div className="Line-transfers">
          {transfers}
        </div>
      );
    }
  }

  renderStations() {
    const line = this.props.line;
    let stationElems = [];
    for (const stationId of line.stationIds) {
      const button = this.props.viewOnly ? '' : (
        <button className="Line-stationRemove" title="Remove from line"
                onClick={() => this.props.onStationRemove(line, stationId)}>
          <i className="fas fa-minus-circle"></i>
        </button>
      );
      stationElems.push(
        <li className="Line-station" key={stationId}>
          <button className="Line-stationButton Link"
                  onClick={() => this.props.onStopClick(stationId)}>
            <div className="Line-stationName">
              {this.props.system.stations[stationId].name}
            </div>
            {this.renderTransfers(stationId)}
          </button>
          {button}
        </li>
      );
    }
    if (!stationElems.length) {
      return <div className="Line-noStations">No stations on this line yet!</div>;
    }
    return (
      <ul className="Line-stations">
        {stationElems}
      </ul>
    );
  }

  renderContent() {
    if (this.state.showColorPicker) {
      return (
        <div className="Line-colorsWrap">
          <div className="Line-colorsText">Choose a new color:</div>
          {this.renderColorOptions()}
          <button className="Line-colorsCancel Link" onClick={() => this.handleColorCancel()}>
            Cancel
          </button>
        </div>
      );
    } else {
      const deleteWrap = (
        <div className="Line-deleteWrap">
          <button className="Line-delete Link" onClick={() => this.props.onDeleteLine(this.props.line)}>
            Delete this line
          </button>
        </div>
      );
      return (
        <div className="Line-stationsWrap">
          {this.renderStations()}
          {this.props.viewOnly ? '' : deleteWrap}
        </div>
      );
    }
  }

  componentDidUpdate() {
    if (this.state.lineId !== null) {
      if (this.props.line && this.props.line.id && this.props.line.id === this.state.lineId) {
        // do nothing
      } else if (this.props.line) {
        this.setState({
          showColorPicker: false,
          nameChanging: false,
          collapsed: true,
          lineId: this.props.line.id
        });
      }
    } else if (this.props.line) {
      this.setState({
        showColorPicker: false,
        nameChanging: false,
        collapsed: true,
        lineId: this.props.line.id
      });

    }
  }

  render() {
    const title = this.state.nameChanging ? this.state.name : this.props.line.name;
    const namePrev = this.props.viewOnly ? (
      <div className="Line-namePrev" style={{backgroundColor: this.props.line.color}}></div>
    ) : (
      <button className="Line-namePrev" style={{backgroundColor: this.props.line.color}}
              onClick={() => this.handleColorChange()}></button>
    );
    const nameElem = this.props.viewOnly ? (
      <div className="Line-name">
        {title ? title : ''}
      </div>
    ) : (
      <input className="Line-name Line-name--input" type="text" value={title ? title : ''}
             onChange={(e) => this.handleNameChange(e.target.value)}
             onBlur={(e) => this.handleNameBlur(e.target.value)}>
      </input>
    );
    return (
      <div className="Line Focus FocusAnim">
        <button className="Line-close" title="Close line view"
                onClick={() => this.props.onFocusClose()}>
          <i className="fas fa-times-circle"></i>
        </button>

        <div className="Line-title">
          {namePrev}
          {nameElem}
        </div>

        <button className={`Line-exCol Line-exCol--${this.state.collapsed ? 'collapsed' : 'expanded'}`}
                onClick={() => this.handleExCol()}>
          <span className="Line-exColText">
            {this.state.collapsed ? 'Show Details' : 'Hide Details'}
          </span>
          <i className="fas fa-chevron-down"></i>
        </button>

        <div className={`Line-content Line-content--${this.state.collapsed ? 'collapsed' : 'expanded'}`}>
          {this.renderContent()}
        </div>
      </div>
    );
  }
}
