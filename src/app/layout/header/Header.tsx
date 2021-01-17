import { h, Component } from 'preact';
import { Link, route } from 'preact-router';
import firebaseInstance from '../../../services/firebase-service';
import styles from './Header.module.scss';

export interface IHeaderProps {

}

export interface IHeaderState {
    userIsLoggedIn: boolean;
    email: string | null;
}

export default class Header extends Component<IHeaderProps, IHeaderState> {

    componentWillMount() {
        firebaseInstance.auth().onAuthStateChanged(u => {
            this.setState({ userIsLoggedIn: u != null, email: u == null ? null : u.email });
        });
    }

    logout = async () => {
        try {
            await firebaseInstance.auth().signOut();
        } finally {
            route('/login', true);
        }
    };

    render() {
        return <header className={styles.header}>
            <Link href="/"><h2>Building AR</h2></Link>
            <span class="flex-auto"></span>
            {this.state.userIsLoggedIn ? <div class={styles.userInfo}><span>{this.state.email}</span><button class="clickable" onClick={this.logout}>Logout</button></div> : null}
        </header>;
    }
}