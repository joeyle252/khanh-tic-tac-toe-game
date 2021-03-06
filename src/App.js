import React, { Component } from 'react'
import Board from './Board'
import FacebookLogin from 'react-facebook-login';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      history: [],
      user: '',
      topRank: [],
    }
  }
  setParentsState = (obj) => {
    this.setState(obj)
  }
  showPast = (item, idx) => {
    this.setState({ squares: item.squares, xIsNext: item.xIsNext, history: this.state.history.filter((e, i) => i <= idx) })
  }
  responseFacebook = (response) => {
    console.log(response);
    this.setState({ user: response.name })
  }
  postData = async (duration) => {
    let data = new URLSearchParams();
    data.append("player", this.state.ueser);
    data.append("score", duration);
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString(),
      json: true
    });
    console.log(response);
    this.getData();
  }
  getData = async () => {
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`;
    let result = await fetch(url);
    let data = await result.json();
    this.setState({ topRank: data.items })
  }

  render() {
    if (!this.state.user) {
      // return (
      //   <FacebookLogin
      //     appId={process.env.REACT_APP_APIID}
      //     autoLoad={false}
      //     fields="name,email,picture"
      //     callback={(resp) => this.responseFacebook(resp)} />
      // )
    }
    return (

      <div className="game" >
        <div className="game-board">
          <h2> User info: {this.state.user}</h2>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <ul style={{ flex: 1 }}>
              {
                this.state.history.map((item, idx) => {
                  return (
                    <li key={idx}>
                      <button onClick={() => this.showPast(item, idx)}>
                        Go to move {idx + 1}
                      </button>
                    </li>
                  )
                })
              }
            </ul>
            <Board
              squares={this.state.squares}
              xIsNext={this.state.xIsNext}
              history={this.state.history}
              setParentsState={this.setParentsState}
              postData={this.postData}
            />
            <ol style={{flex:5}}> Top Score
            {
                this.state.topRank.map((item) => {
                  return (
                    <li key={item}>
                      {item.player}: {item.score}
                    </li>
                  )
                })}
            </ol>
          </div>
        </div>
      </div>
    );
  }
}
