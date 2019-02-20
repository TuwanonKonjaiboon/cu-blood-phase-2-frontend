import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import {
	Menu,
	Header,
	Item,
	Label,
	Button,
	Input,
	Modal
} from "semantic-ui-react";

import { fetchStaffs, deleteStaff } from "../../actions";

class ManageStaff extends Component {
	state = {
		staff_status: "staff",
		staff_results: [],
		isfetched: false
	};

	componentDidMount = async () => {
		await this.props.fetchStaffs();
		setTimeout(() => {
			this.setState({
				isfetched: true
			});
		}, 100);
		this.resetComponent();
	};

	componentWillMount() {
		this.resetComponent();
	}

	handleDeleteClick = async id => {
		await this.props.deleteStaff(id);
		this.setState({
			staff_results: this.state.staff_results.filter(staff => staff.id !== id)
		});
	};

	resetComponent = () =>
		this.state.staff_status === "staff"
			? this.setState({
					isLoading: false,
					staff_results: this.props.staffs,
					value: ""
			  })
			: //   is pending change here: from this.props.staffs to this.props.staffs.filter(staff => !isApproved)
			  this.setState({
					isLoading: false,
					staff_results: this.props.staffs,
					value: ""
			  });

	handleSearchChange = (e, { value }) => {
		const { staffs } = this.props;

		this.setState({ isLoading: true, value });

		setTimeout(() => {
			if (this.state.value.length < 1) return this.resetComponent();

			const re = new RegExp(_.escapeRegExp(this.state.value), "i");
			const isMatch = result => re.test(result.email); // <-- change type of searching

			this.setState({
				isLoading: false,
				staff_results: _.filter(staffs, isMatch)
			});

			console.log(this.state.staff_results);
		}, 300);
	};

	renderAdmin = id => {
		const { user } = this.props;

		if (user && user.isAdmin && user.id !== id) {
			return (
				<>
					<Modal
						trigger={
							<Button name='delete' negative floated='right'>
								Delete
							</Button>
						}
						header='Delete Staff'
						content={`Are you sure to delete this staff`}
						actions={[
							{
								key: "delete",
								content: "Delete",
								negative: true,
								onClick: e => this.handleDeleteClick(id)
							},
							{ key: "cancel", content: "Cancel" }
						]}
					/>

					<Button name='view' floated='right'>
						View
					</Button>
				</>
			);
		}

		return null;
	};

	renderList = () => {
		const { staff_results, isfetched } = this.state;
		if (!isfetched) {
			return (
				<div>
					<h2>Loading...</h2>
				</div>
			);
		}

		if (staff_results.length > 0) {
			return staff_results.map(staff => {
				return (
					<Item key={staff.id}>
						<Item.Content>
							<Item.Header as='a'>{staff.username}</Item.Header>
							<Item.Meta>
								<span className='cinema'>{staff.email}</span>
							</Item.Meta>
							<Item.Description>{}</Item.Description>
							<Item.Extra>
								{this.renderAdmin(staff.id)}
								<Label>Limited</Label>
							</Item.Extra>
						</Item.Content>
					</Item>
				);
			});
		}

		return (
			<div>
				<h2>No Result</h2>
			</div>
		);
	};

	handleItemClick = (e, { name }) => this.setState({ staff_status: name });

	render() {
		const { staff_status, isLoading, value } = this.state;

		return (
			<div>
				<Header
					size='huge'
					style={{ marginTop: "20px", paddingLeft: "1.5rem" }}
				>
					Manage Staff
				</Header>
				<Menu secondary stackable>
					<Menu.Item header>Status</Menu.Item>
					<Menu.Item
						name='staff'
						active={staff_status === "staff"}
						onClick={this.handleItemClick}
					/>
					<Menu.Item
						name='pending'
						active={staff_status === "pending"}
						onClick={this.handleItemClick}
					/>

					<Menu.Menu position='right'>
						<Menu.Item>
							<Input
								loading={isLoading}
								icon='search'
								placeholder='Search...'
								onChange={_.debounce(this.handleSearchChange, 500, {
									leading: true
								})}
								value={value}
							/>
						</Menu.Item>
					</Menu.Menu>
				</Menu>
				<div className='ui container' style={{ marginTop: "40px" }}>
					<Item.Group divided>{this.renderList()}</Item.Group>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.user,
		staffs: Object.values(state.staffs)
	};
};

export default connect(
	mapStateToProps,
	{ fetchStaffs, deleteStaff }
)(ManageStaff);
