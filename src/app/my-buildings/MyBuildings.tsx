import {h, Component} from 'preact';
import { Link, route } from 'preact-router';
import { Building } from '../../models/building';
import firebaseInstance from '../../services/firebase-service';
import qrServiceInstance from '../../services/qr-service';
import styles from './MyBuildings.module.scss';

export interface IMyBuildingsProps{

}

export interface IMyBuildingsState {
    buildings: Building[];
    unsubscribe: () => void;
}

export default class MyBuildings extends Component<IMyBuildingsProps, IMyBuildingsState> {

    constructor() {
        super();
        this.setState({
            buildings: []
        })
    }

    async componentWillMount() {
        firebaseInstance.auth().onAuthStateChanged(async user => {
            if (user == null) {
                route('/login', true);
                return;
            }
            const q = firebaseInstance.firestore().collection('buildings').where('userId', '==', user.uid).onSnapshot(qs => {
                this.setState({buildings: qs.docs.map(d => {
                    const data = d.data() as Building;
                    data.id = d.id;
                    return data;
                })}); 
            });
            this.setState({unsubscribe: q});
        });
    }

    componentWillUnmount() {
        if (this.state.unsubscribe != null) {
            this.state.unsubscribe();
        }
    }

    deleteBuilding = async (id: string) => {
        if (confirm('Are you sure?')) {
            await firebaseInstance.firestore().collection('buildings').doc(id).delete();
        }
    };

    goToView = (id: string) => {
        route(`/view/${id}`);
    };

    getQr = async (id: string, name: string) => {
        const url = `${window.location.origin}/view/${id}`;
        const base64 = await qrServiceInstance.getMarkerQrForUrlAsBase64(url);
        this.downloadBase64File(name, base64);
    };

    downloadBase64File = (name: string, base64: string): void => {
        const a = window.document.createElement('a', {});
        a.href = base64;
        a.download = name + '.png';
        a.click();
    }

    render() {
        return <div className={styles.myBuildings}>
            <h1>My Buildings</h1>
            <ul>
                {
                    this.state.buildings.map((b, i) => <li className={i%2===0 ? styles.even : null}>
                        <Link href={'/edit-building/' + b.id}>{b.name}</Link>
                        <div>
                            <button style="margin-right: 0.3rem" onClick={() => this.goToView(b.id)} class="clickable">View</button>
                            <button style="margin-right: 0.3rem" onClick={() => this.getQr(b.id, b.name)} class="clickable">Download</button>
                            <button onClick={() => this.deleteBuilding(b.id)} class="clickable">Delete</button>
                        </div>
                    </li>)
                }
            </ul>
            <Link href="/add-building"><button class="clickable">Add building</button></Link>
        </div>;
    }
}