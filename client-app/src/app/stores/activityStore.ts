import {
	action,
	computed,
	configure,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';
import { IActivity } from '../models/activity';

configure({ enforceActions: 'always' });

class ActivityStore {
	constructor() {
		makeObservable(this);
	}

	@observable activityRegistry = new Map<string, IActivity>();
	@observable loadingInitial = false;
	@observable selectedActivity: IActivity | undefined;
	@observable editMode = false;
	@observable submitting = false;
	@observable target = '';

	@computed get activitiesByDate() {
		return Array.from(this.activityRegistry.values())
			.slice()
			.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
	}

	@action loadActivities = async () => {
		this.loadingInitial = true;
		try {
			const activities = await agent.Activities.list();
			runInAction(() => {
				activities.forEach((activity) => {
					activity.date = activity.date.split('.')[0];
					this.activityRegistry.set(activity.id, activity);
				});
			});
		} catch (error) {
			console.log(error);
		} finally {
			runInAction(() => {
				this.loadingInitial = false;
			});
		}
	};

	@action selectActivity = (id: string) => {
		this.selectedActivity = this.activityRegistry.get(id);
		this.editMode = false;
	};

	@action cancelSelectedActivity = () => {
		this.selectedActivity = undefined;
	};

	@action cancelFormOpen = () => {
		this.editMode = false;
	};

	@action createActivity = async (activity: IActivity) => {
		this.submitting = true;
		try {
			await agent.Activities.create(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.selectedActivity = activity;
				this.editMode = false;
			});
		} catch (error) {
			console.log(error);
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};

	@action editActivity = async (activity: IActivity) => {
		this.submitting = true;
		try {
			await agent.Activities.update(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.selectedActivity = activity;
				this.editMode = false;
			});
		} catch (error) {
			console.log(error);
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};

	@action deleteActivity = async (
		event: SyntheticEvent<HTMLButtonElement>,
		id: string
	) => {
		this.submitting = true;
		this.target = event.currentTarget.name;
		try {
			await agent.Activities.delete(id);
			runInAction(() => {
				this.activityRegistry.delete(id);
			});
		} catch (error) {
			console.log(error);
		} finally {
			runInAction(() => {
				this.submitting = false;
				this.target = '';
			});
		}
	};

	@action openCreateForm = () => {
		this.selectedActivity = undefined;
		this.editMode = true;
	};

	@action openEditForm = (id: string) => {
		this.selectedActivity = this.activityRegistry.get(id);
		this.editMode = true;
	};
}

export default createContext(new ActivityStore());
