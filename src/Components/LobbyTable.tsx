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
          <Table.HeaderCell>Lobby Size</Table.HeaderCell>
          <Table.HeaderCell>Join</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {lobbyList.map((lobby) => {
        return (<Table.Body>
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
      {/* <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Header as='h4' image>
              <Image src='/images/avatar/small/lena.png' rounded size='mini' />
              <Header.Content>
                Lena
                <Header.Subheader>Human Resources</Header.Subheader>
              </Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>Test Lobby</Table.Cell>
          <Table.Cell>18+</Table.Cell>
          <Table.Cell>0/30</Table.Cell>
          <Table.Cell>
            <Button animated='fade'>
              <Button.Content visible>Click To Join</Button.Content>
              <Button.Content hidden>Join Now</Button.Content>
            </Button>
          </Table.Cell>
        </Table.Row>

      </Table.Body> */}
    </Table>
  );
}

export default TableExampleCollapsing;
