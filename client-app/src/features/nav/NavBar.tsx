import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';

interface IProps {
	openCreateMode: () => void;
}

const NavBar: React.FC<IProps> = ({ openCreateMode }) => {
	return (
		<Menu fixed='top' inverted>
			<Container>
				<Menu.Item header>
					<img
						src='/assets/logo.png'
						alt='logo'
						style={{ marginRight: '10px' }}
					/>
					Reactivities
				</Menu.Item>
				<Menu.Item name='Activities' />
				<Menu.Item>
					<Button
						onClick={() => openCreateMode()}
						positive
						content='Create Activity'
					/>
				</Menu.Item>
			</Container>
		</Menu>
	);
};

export default NavBar;
