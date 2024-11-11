import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10, 
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 0, 
    marginRight: 5, 
  },
  welcomeText: {
    color: '#ff6600',
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },

  footer: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    color: '#777',
  },
  blackLink: {
    color: '#000',
    textDecorationLine: 'underline',
  },
  footerText2: {
    marginTop: 15,
    color: '#777',
    fontWeight: 'bold',
  },
  orangeLink: {
    color: '#ff6600',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#ff6600',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonContainer: {
    width: '100%',
    marginTop: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  logoContainer: {
    marginTop: -35,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 185,
    height: 185,
  },
});