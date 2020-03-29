import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Container, SubmitButton, Form, List } from './styles';
import api from '../../services/api';
export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
    };

    handleInputChange = (e) => {
        this.setState({ newRepo: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        const { newRepo, repositories } = this.state;
        const { data } = await api.get(`/repos/${newRepo}`);

        const repoData = {
            name: data.full_name,
        };

        this.setState({
            repositories: [...repositories, repoData],
            newRepo: '',
            loading: false,
        });
    };

    render() {
        const { newRepo, loading, repositories } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />
                    <SubmitButton loading={loading}>
                        {loading ? (
                            <FaSpinner color={'#FFF'} size={14} />
                        ) : (
                            <FaPlus color={'#FFF'} size={14} />
                        )}
                    </SubmitButton>
                </Form>

                <List>
                    {repositories.map((repo) => (
                        <li key={repo.name}>
                            <span>{repo.name}</span>
                            <a href="">Detalhes</a>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
