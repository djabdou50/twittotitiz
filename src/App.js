import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Album from './components/album';
import './App.css';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
    uri: "http://localhost:4000/graphql"
});

function App() {
  return (
      <ApolloProvider client={client}>
        <div className="App">
            <header>

                <div className="navbar navbar-dark bg-dark box-shadow">
                    <div className="container d-flex justify-content-between">
                        <a href="#4" className="navbar-brand d-flex align-items-center">

                            <strong>TwittoTitiz</strong>
                        </a>
                    </div>
                </div>
            </header>

            <main role="main">

                <section className="jumbotron text-center">
                    <div className="container">
                        <h1 className="jumbotron-heading">Twitto..Titiz</h1>
                        <p className="lead text-muted">This is a test of a Machine learning that analyses twitter hashtag #selfie stream, and classifies images by male/female </p>
                        <p>
                            {/*<a href="#2" className="btn btn-primary my-2">Main call to action</a>*/}
                            {/*<a href="#1" className="btn btn-secondary my-2">Secondary action</a>*/}
                        </p>
                    </div>
                </section>


                {/*<Album/>*/}
                <Album/>

            </main>


                <footer className="text-muted">
                    <div className="container">
                        <p className="float-right">
                            <a href="#5">Back to top</a>
                        </p>
                        <p>Album example is &copy; Bootstrap, but please download and customize it for yourself!</p>
                        <p>New to Bootstrap? <a href="../../">Visit the homepage</a> or read our <a
                            href="../../getting-started/">getting started guide</a>.</p>
                    </div>
                </footer>


        </div>
      </ApolloProvider>
  );
}

export default App;
