import {h, Component} from 'preact';
import styles from './Footer.module.scss';
import {v} from '../../../version';
export interface IFooterProps {

}

export interface IFooterState {
    version: string;
}

export default class Footer extends Component<IFooterProps, IFooterState> {
    constructor(props: IFooterProps, state: IFooterState) {
        super(props, state);
        this.setState({
            version: v === '__version__' ? 'local' : v
        });
    }
    render() {
        return <footer className={styles.footer}>
            <div>Copyright &copy; 2020 Alin Ciu - Version {this.state.version}</div>
        </footer>;
    }
}