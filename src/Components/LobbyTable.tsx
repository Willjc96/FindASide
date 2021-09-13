import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Image, Table, Button } from 'semantic-ui-react';
import useWindowDimensions from '../windowSize';

interface LobbyObject {
  lobbyName?: string;
  userId?: string;
  userName?: string;
  lobbyDescription?: string;
  gameId?: string;
  lobbyCount?: string;
  lobbyAvatar?: string;
  lobbySize?: string;
  lobbyDifficulty?: string;
  lobbyConsole?: string;
}
interface IProps {
  lobbyList: LobbyObject[];
}


function TableExampleCollapsing(props: IProps) {
  const lobbyList = props.lobbyList;
  const { width } = useWindowDimensions();
  return (
    <Table basic='very' celled collapsing>
      <Table.Header className='table-header'>
        <Table.Row>
          <Table.HeaderCell>Hosts Name</Table.HeaderCell>
          <Table.HeaderCell>Lobby Name</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell>Console</Table.HeaderCell>
          <Table.HeaderCell>Skill Rating</Table.HeaderCell>
          <Table.HeaderCell>Lobby Size</Table.HeaderCell>
          <Table.HeaderCell>View</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {lobbyList.map((lobby) => {
        if (width > 767) {
          return (
            <Table.Body key={lobby.userId}>
              <Table.Row >
                <Table.Cell>
                  <Header as='h4' image>
                    <Image src={lobby.lobbyAvatar} rounded size='mini' />
                    <Header.Content>
                      {lobby.userName}
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>{lobby.lobbyName}</Table.Cell>
                <Table.Cell>{lobby.lobbyDescription}</Table.Cell>
                <Table.Cell>{lobby.lobbyConsole}</Table.Cell>
                <Table.Cell>{lobby.lobbyDifficulty}</Table.Cell>
                <Table.Cell>{`${lobby.lobbyCount}/${lobby.lobbySize}`}</Table.Cell>
                <Table.Cell>
                  <Link to={`/lobby/${lobby.gameId}/${lobby.userId}`}>
                    <Button animated='fade'>
                      <Button.Content visible>Click To View</Button.Content>
                      <Button.Content hidden>View Lobby</Button.Content>
                    </Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          );
        }
        else {
          return (
            <Table.Body key={lobby.userId}>
              <Table.Row >
                <Table.Cell>
                  <Header as='h4' image>
                    <Image src={lobby.lobbyAvatar} rounded size='mini' />
                    <Header.Content>
                      {lobby.userName}
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell><span className='bold-span'>Lobby Name: </span>{lobby.lobbyName}</Table.Cell>
                <Table.Cell><span className='bold-span'>Description: </span>{lobby.lobbyDescription}</Table.Cell>
                <Table.Cell><span className='bold-span'>Console: </span>{lobby.lobbyConsole}</Table.Cell>
                <Table.Cell><span className='bold-span'>Skill Rating: </span>{lobby.lobbyDifficulty}</Table.Cell>
                <Table.Cell><span className='bold-span'>Lobby Size: </span>{`${lobby.lobbyCount}/${lobby.lobbySize}`}</Table.Cell>
                <Table.Cell>
                  <Link to={`/lobby/${lobby.gameId}/${lobby.userId}`}>
                    <Button animated='fade'>
                      <Button.Content visible>Click To View</Button.Content>
                      <Button.Content hidden>View Lobby</Button.Content>
                    </Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          );
        }
      })}
    </Table>
  );
}

export default TableExampleCollapsing;