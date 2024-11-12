// stylesRegistro.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F8F8", // Color de fondo de la pantalla
  },
  logoContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFA500", // Color del texto de "Registro"
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#FFA500", // Color del borde de los inputs
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#FFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#FFA500", // Color del borde de los campos de contraseña
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: "#333", // Color del texto del input
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#ff6600", // Color del botón
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF", // Color del texto del botón
    fontSize: 18,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: "#666",
  },
});

export default styles;
