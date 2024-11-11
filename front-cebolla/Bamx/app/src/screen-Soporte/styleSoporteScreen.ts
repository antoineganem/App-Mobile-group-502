import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  section: {
    marginBottom: 40,
  },
  header: {
    fontSize: 18,
    color: 'orange',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  faqItem: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  faqContent: {
    textAlign: 'justify',
    marginBottom: 20,
  },
  contactSection: {
    marginTop: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default styles;
