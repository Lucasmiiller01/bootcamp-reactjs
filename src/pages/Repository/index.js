import React, { Component } from 'react';
import api from '../../services/api';
import PropsTypes from 'prop-types';
import { Loading, Owner, IssuesList } from './styles';
import Container from '../../components/Container';
import { Link } from 'react-router-dom';
export default class Repository extends Component {
    static propsTypes = {
        match: PropsTypes.shape({
            params: PropsTypes.shape({
                repository: PropsTypes.string,
            }),
        }).isRequired,
    };

    state = {
        repository: {},
        issues: [],
        loading: true,
    };
    async componentDidMount() {
        const {
            match: { params },
        } = this.props;

        const repoName = decodeURIComponent(params.repository);

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    state: 'open',
                    per_page: 5,
                },
            }),
        ]);

        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false,
        });
    }

    render() {
        const { repository, issues, loading } = this.state;

        if (loading) {
            return <Loading> Carregando </Loading>;
        }
        return (
            <Container>
                <Owner>
                    <Link to="/"> Voltar aos repositorios </Link>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>
                <IssuesList>
                    {issues.map((issue) => (
                        <li key={String(issue.id)}>
                            <img
                                src={issue.user.avatar_url}
                                alt={issue.user.login}
                            />
                            <div>
                                <strong>
                                    <a href={issue.html_url}> {issue.title}</a>
                                    {issue.labels.map((label) => (
                                        <span key={String(label.id)}>
                                            {label.name}
                                        </span>
                                    ))}
                                </strong>
                                <p>{issue.user.login} </p>
                            </div>
                        </li>
                    ))}
                </IssuesList>
            </Container>
        );
    }
}
