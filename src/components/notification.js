import React from 'react';
import ReactNotifications from 'react-browser-notifications';

class Notification extends React.Component {
    constructor() {
        super();
        this.showNotifications = this.showNotifications.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    showNotifications() {
        // If the Notifications API is supported by the browser
        // then show the notification
        if(this.n.supported()) this.n.show();
    }

    handleClick(event) {
        // Do something here such as
        // console.log("Notification Clicked") OR
        // window.focus() OR
        // window.open("http://www.google.com")

        // Lastly, Close the notification
        this.n.close(event.target.tag);
    }

    componentDidUpdate(prevProps) {

        // console.log(this.props.notification)
        // Typical usage (don't forget to compare props):
        if (this.props.notification.id !== prevProps.notification.id) {
            this.showNotifications()
        }
    }

    render() {
        return (
            <div>

                <ReactNotifications
                    onRef={ref => (this.n = ref)} // Required
                    title={this.props.notification.screen_name} // Required
                    body={this.props.notification.text}
                    icon={this.props.notification.media}
                    tag="abcdef"
                    timeout="10000"
                    onClick={event => this.handleClick(event)}
                />

            </div>
        )
    }
}

export default Notification;