import React, { useState, useEffect} from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  },[])

  async function handleLikeRepository(id) {
    // Implement "Like Repository" functionality
    const response = await api.post(`repositories/${id}/like`)

    // If 
    if(response.status !== 400) {
      // get repository index
      const repo = repositories.findIndex(repo => repo.id === id);

      // clone reposity
      const newRepositories = [...repositories];

      // change data using the new data
      newRepositories[repo] = response.data;

      // change the state with new data
      setRepositories(newRepositories);

    } else {
      console.log('Error ocurred')
    }
    
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={( { item: repository }) => (
            <View style={styles.repositoryContainer} key={repository.id}>   
              <Text style={styles.repository}>{repository.title}</Text>
              <View style={styles.techsContainer}>
                {
                  repository.techs.map((tech, index) => {
                    return(
                        <Text style={styles.tech} key={index}>
                          {tech}
                        </Text>
                    )
                  })
                }
                        
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
              >{repository.likes} curtida{repository.likes > 1 && 's'}</Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
          </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
