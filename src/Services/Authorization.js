import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, signInAnonymously ,signOut , onAuthStateChanged, setPersistence, browserLocalPersistence ,sendPasswordResetEmail} from "firebase/auth";
import { auth } from "./FirebaseConfig";
import Cookies from "js-cookie";
