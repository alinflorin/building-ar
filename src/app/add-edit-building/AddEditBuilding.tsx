import { h, Component } from 'preact';
import { route } from 'preact-router';
import { Building } from '../../models/building';
import firebaseInstance from '../../services/firebase-service';
import zipServiceInstance from '../../services/zip-service';
import styles from './AddEditBuilding.module.scss';

export interface IAddEditBuildingProps {
    id?: string;
}

export interface IAddEditBuildingState {
    building: Building;
    isEdit: boolean;
    userId: string;
    errors: string[];
}

export default class AddEditBuilding extends Component<IAddEditBuildingProps, IAddEditBuildingState> {

    constructor() {
        super();
        this.setState({ errors: [] });
    }

    async componentWillMount() {
        firebaseInstance.auth().onAuthStateChanged(async user => {
            if (user == null) {
                route('/login', true);
                return;
            }
            let building: Building;
            if (this.props.id != null && this.props.id.length > 0) {
                const doc = await firebaseInstance.firestore().collection('buildings').doc(this.props.id).get();
                if (doc.exists) {
                    building = doc.data() as Building;
                    building.id = doc.id;
                } else {
                    this.setState({ errors: ['Building doesn\'t exist'] });
                }
            } else {
                building = {
                    userId: user.uid,
                    name: 'New Building'
                } as Building;
            }
            this.setState({
                userId: user.uid,
                building: building,
                isEdit: building != null && building.id != null
            });
        });
    }

    onZipUpload = async (e: Event) => {
        const input = e.target as HTMLInputElement;
        const zipFile = input.files.item(0);
        const allFilesInZip = await zipServiceInstance.unzip(await zipFile.arrayBuffer());
        const storage = firebaseInstance.storage().ref();
        const now = new Date().getTime();
        for (let fileFromArchive of allFilesInZip) {
            const f = storage.child(`buildings/${this.state.userId}/${now}/${fileFromArchive.name}`);
            await f.put(fileFromArchive.contents);
            if (fileFromArchive.name.toLowerCase().endsWith('.gltf')) {
                this.setState({ building: { ...this.state.building, objUrl: `https://storage.googleapis.com/building-augmented-reality.appspot.com/buildings/${this.state.userId}/${now}/${fileFromArchive.name}` } });
            }
        }
        input.files = null;
    };

    save = async (event: Event) => {
        event.preventDefault();
        if (this.state.isEdit) {
            await firebaseInstance.firestore().collection('buildings').doc(this.props.id).update(this.state.building);
        } else {
            await firebaseInstance.firestore().collection('buildings').add(this.state.building);
        }
        route('/my-buildings');
    };

    isFormValid(): boolean {
        return this.state.building != null && this.state.building.name != null && this.state.building.name.length > 0 &&
            this.state.building.objUrl != null && this.state.building.objUrl.length > 0;
    }

    render() {
        return <div className={styles.addEditBuilding}>
            {this.state.errors.length > 0 && <ul class="errors">
                {this.state.errors.map(e => <li>{e}</li>)}
            </ul>}
            {this.state.building == null ? <div>Loading</div> : <form autoComplete="false" noValidate onSubmit={this.save}>
                <h2>{this.state.isEdit ? 'Edit' : 'Add'}</h2>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" name="name" id="name"
                        onKeyUp={(e: any) => this.setState({ building: { ...this.state.building, name: e.target.value } })}
                        value={this.state.building.name} required />
                </div>
                <div class="form-group">
                    <label for="name">GLTF model (zip)</label> <br />
                    <input type="file" name="gltfModel" id="gltfModel" accept=".zip" onChange={(e) => this.onZipUpload(e)} /><br />
                    <span>Model URL: {this.state.building.objUrl}</span>
                </div>
                <div class="form-group center">
                    <button disabled={!this.isFormValid()} type="submit">Save</button>
                </div>
            </form>}
        </div>;
    }
}