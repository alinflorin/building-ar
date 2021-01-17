import { h, Component } from 'preact';
import styles from './Login.module.scss';
import {route} from 'preact-router';
import firebaseInstance from '../../services/firebase-service';

export interface ILoginProps {

}

export interface ILoginState {
    email: string;
    password: string;
    errors: string[];
}

export default class Login extends Component<ILoginProps, ILoginState> {

    constructor(props: ILoginProps, state: ILoginState) {
        super(props, state);
        this.setState({
            email: '',
            password: '',
            errors: []
        });
    }

    login = async (event: Event) => {
        event.preventDefault();
        this.setState({
            errors: []
        })
        try {
            await firebaseInstance.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
            route('/my-buildings', true);
        } catch (err) {
            this.setState({
                errors: [err.message]
            })
        }
    };

    private validate(email: string) {
        if (email == null) {
            return false;
        }
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
    }

    isFormValid(): boolean {
        return this.state.email.length > 0 && this.state.password.length > 0 && this.validate(this.state.email);
    }

    render() {
        return <div className={styles.login}>
            <form autoComplete="false" noValidate onSubmit={this.login}>
                <h2>Login</h2>
                {this.state.errors.length > 0 && <ul class="errors">
                    {this.state.errors.map(e => <li>{e}</li>)}
                </ul>}
                <div class="form-group">
                    <label for="email">E-Mail</label>
                    <input type="email" name="email" id="email"
                        onKeyUp={(e: any) => this.setState({ email: e.target.value })}
                        value={this.state.email} required />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password"
                        onKeyUp={(e: any) => this.setState({ password: e.target.value })}
                        value={this.state.password} required />
                </div>
                <div class="form-group center">
                    <button disabled={!this.isFormValid()} type="submit">Login</button>
                </div>
            </form>
        </div>;
    }
}