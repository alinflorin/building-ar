import { h, Component } from 'preact'
import { route } from 'preact-router';
import { Building } from '../../models/building';
import firebaseInstance from '../../services/firebase-service';
import styles from './View.module.scss';

export interface IViewProps {
    id: string;
}

export interface IViewState {
    id: string;
    errors: string[];
    isLoading: boolean;
    building: Building;
}

export default class View extends Component<IViewProps, IViewState> {

    constructor(props: IViewProps, state: IViewState) {
        super(props, state);
    }

    async componentWillMount() {
        this.setState({ isLoading: true, id: this.props.id });

        if (this.props.id == null || this.props.id.length === 0) {
            route('/404');
            return;
        }
        const fireStore = firebaseInstance.firestore();
        const buildingsCollection = fireStore.collection('buildings');
        const foundBuildingDs = await buildingsCollection.doc(this.props.id).get();
        if (!foundBuildingDs.exists) {
            route('/404');
            return;
        }
        const building = foundBuildingDs.data() as Building;
        this.setState({ building: building, isLoading: false });
    }

    render() {
        return <div className={styles.view}>
            {this.state.isLoading ? <h1>Loading</h1> :
                <iframe className={styles.iframe} src={`/ar.html?url=` + encodeURIComponent('https://arjs-cors-proxy.herokuapp.com/' + this.state.building.objUrl)}></iframe>
            }
        </div>;
    }
}