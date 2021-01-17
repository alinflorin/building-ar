import {h, Component} from 'preact';
import { Link } from 'preact-router';
import firebaseInstance from '../../services/firebase-service';
import styles from './Home.module.scss';

export interface IHomeProps{

}

export interface IHomeState {
    isLoggedIn: boolean;
}

export default class Home extends Component<IHomeProps, IHomeState> {
    componentWillMount() {
        firebaseInstance.auth().onAuthStateChanged(u => {
            this.setState({isLoggedIn: u != null});
        });
    }

    render() {
        return <div className={styles.home}>
            <h1>Home</h1>
            <p>Hello, product info</p>
            {this.state.isLoggedIn ? <Link href="/my-buildings"><button class="clickable">Go to my buildings</button></Link> : 
            <Link href="/login"><button class="clickable">Go to login</button></Link>}
        </div>;
    }
}