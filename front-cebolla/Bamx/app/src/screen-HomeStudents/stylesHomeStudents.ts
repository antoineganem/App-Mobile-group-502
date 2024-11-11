// styles.ts
import { StyleSheet } from 'react-native';

const stylesHome = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  closeIconContainer: {
    width: 60, 
    height: 60, 
    justifyContent: 'center',
    alignItems: 'center',
    top: -16,
    right: -30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  categoryButton: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
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
  searchIcon: {
    marginLeft: 8, 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sidebarContainer: {
    width: '75%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    position: 'absolute',
    left: 0,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  logoutIcon: {
    marginRight: 10, 
  },
  logoutButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFA500',
    paddingVertical: 15, 
    alignItems: 'flex-start', 
    paddingLeft: 20,  
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 20,
    padding: 10,
  },
});

export default stylesHome;
