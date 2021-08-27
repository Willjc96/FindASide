import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Image, Table, Button } from 'semantic-ui-react';
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
}
interface IProps {
  lobbyList: LobbyObject[];
}


function TableExampleCollapsing(props: IProps) {
  const lobbyList = props.lobbyList;
  return (
    <Table basic='very' celled collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Hosts Name</Table.HeaderCell>
          <Table.HeaderCell>Lobby Name</Table.HeaderCell>
          <Table.HeaderCell>Lobby Description</Table.HeaderCell>
          <Table.HeaderCell>Lobby Skill Rating</Table.HeaderCell>
          <Table.HeaderCell>Lobby Size</Table.HeaderCell>
          <Table.HeaderCell>Join</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {lobbyList.map((lobby) => {
        return (<Table.Body key={lobby.userId}>
          <Table.Row>
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

        </Table.Body>);
      })}
    </Table>
  );
}

export default TableExampleCollapsing;
