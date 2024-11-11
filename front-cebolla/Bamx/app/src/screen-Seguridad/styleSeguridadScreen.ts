// styleSeguridadScreen.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  header: {
    fontSize: 18,
    color: 'orange',
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#ff6600',
  },
  policyContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    maxHeight: '32%', // Limita la altura a la mitad de la pantalla
  },
  policyText: {
    fontSize: 14,
    textAlign: 'justify',
  },
  termsContainer: {
    marginTop: -15,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  termText: {
    fontSize: 16,
    flex: 1, // Para que el texto ocupe el espacio disponible
    marginRight: 10, // Espacio entre el texto y el checkbox
  },
  multiFactorButton: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  multiFactorButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  homeIconContainer: {
    position: 'absolute',
    bottom: 20, 
    left: '54.5%',
    transform: [{ translateX: -16 }],
    backgroundColor: '#FFA500',
    borderRadius: 32,
    padding: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default styles;