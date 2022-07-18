import Distance from './Distance';
import Duration from './Duration';
import Geojson from './Geojson';
import { formatDateTime } from '../../../shell/services-deprecated/formatters/formatters';

class Trail {
  constructor({
    entityType = Trail.entityType.TRIP,
    id,
    taskTrail,
    tripTrail,
    branch,
    branchHub,
    pilotHub,
    tripTasks,
    assignmentDate,
    assignmentLocation,
    zone,
    rate,
  } = {}) {
    this.entityType = entityType;
    this.id = id;

    if (tripTrail && Geojson.isValidLineString(tripTrail)) {
      this.tripTrail = tripTrail;
    }
    if (taskTrail && Geojson.isValidLineString(taskTrail)) {
      this.taskTrail = taskTrail;
    }
    if (branch && Geojson.isValidPoint(branch.location)) {
      this.branch = branch;
    }

    if (branchHub && Geojson.isValidPoint(branchHub.location)) {
      this.branchHub = branchHub;
    }

    if (pilotHub && Geojson.isValidPoint(pilotHub.location)) {
      this.pilotHub = pilotHub;
    }

    if (assignmentDate && Geojson.isValidPoint(assignmentLocation)) {
      this.tripAssignment = {
        location: assignmentLocation,
        date: assignmentDate,
      };
    }

    if (tripTasks && tripTasks.length) {
      this.tripTasks = tripTasks
        .filter((task) => Geojson.isValidPoint(task.pinnedDestinationPoint))
        .map((task) => ({
          ...task,
          totalDistance: new Distance({ value: task.distanceInMeters }),
          distanceFromPreviousTask: new Distance({
            value: task.distanceFromLastTaskInMeters,
          }),
          totalDuration: new Duration({ value: task.durationInSeconds }),
          durationSincePreviousTask: new Duration({
            value: task.durationSinceLastTask,
          }),
        }));
    }

    if (zone && Geojson.isValidPolygon(zone.polygon)) {
      this.zone = { ...zone, rate };
    }
  }

  toGeojson() {
    const geojson = {
      type: 'FeatureCollection',
      features: [],
    };

    if (this.tripTrail) {
      geojson.features.push({
        type: 'Feature',
        geometry: this.tripTrail,
        properties: {
          dataType: 'TRIP_TRAIL',
          ...(this.entityType == Trail.entityType.TASK && {
            inactive: true,
          }),
        },
      });
    }

    if (this.taskTrail) {
      geojson.features.push({
        type: 'Feature',
        geometry: this.taskTrail,
        properties: {
          dataType: 'TASK_TRAIL',
        },
      });
    }

    if (this.tripTasks) {
      geojson.features.push(
        ...this.tripTasks.map((task) => ({
          type: 'Feature',
          geometry: task.pinnedDestinationPoint,
          properties: {
            dataType: 'DELIVERY_POINT',
            sequence: task.sequence,
            ...(this.entityType == Trail.entityType.TASK &&
              task.id != this.id && {
                inactive: true,
              }),
            template:
              `<div><h4 style="display: inline">Reaching Date:</h4> ${formatDateTime(
                task.reachedDestinationDate
              )}</div>` +
              `<div><h4 style="display: inline">Total Distance:</h4> ${
                task.totalDistance.toKm().value
              } km</div>` +
              `<div><h4 style="display: inline">Distance From Previous Order:</h4> ${
                task.distanceFromPreviousTask.toKm().value
              } km</div>` +
              `<div><h4 style="display: inline">Total Duration:</h4> ${task.totalDuration.humanize()}</div>` +
              `<div><h4 style="display: inline">Duration Since Previous Order:</h4> ${task.durationSincePreviousTask.humanize()}</div>`,
          },
        }))
      );
    }

    if (this.branch) {
      geojson.features.push({
        type: 'Feature',
        geometry: this.branch.location,
        properties: {
          dataType: 'BRANCH_LOCATION',
          template: `<h3>${this.branch.label}</h3>`,
        },
      });
    }

    if (this.branchHub) {
      geojson.features.push({
        type: 'Feature',
        geometry: this.branchHub.location,
        properties: {
          dataType: 'BRANCH_HUB',
          template: `<h3>Branch Hub</h3><div>${this.branchHub.label}</div>`,
        },
      });
    }

    if (this.pilotHub) {
      geojson.features.push({
        type: 'Feature',
        geometry: this.pilotHub.location,
        properties: {
          dataType: 'PILOT_HUB',
          template: `<h3>Pilot Hub</h3><div>${this.pilotHub.label}</div>`,
        },
      });
    }

    if (this.tripAssignment) {
      geojson.features.push({
        type: 'Feature',
        geometry: this.tripAssignment.location,
        properties: {
          dataType: 'ASSIGNMENT_LOCATION',
          template: `<h3>Assignment Location</h3><div>${formatDateTime(
            this.tripAssignment.date
          )}</div>`,
        },
      });
    }

    if (this.zone) {
      geojson.features.push({
        type: 'Feature',
        geometry: this.zone.polygon,
        properties: {
          dataType: 'TASK_ZONE',
          en: this.zone.name.en,
          ar: this.zone.name.ar,
          rateText: `${this.zone.rate.name.en} - ${this.zone.rate.name.ar}`,
          rate: this.zone.rate.name.en.toUpperCase(),
        },
      });
    }

    return geojson;
  }

  static get entityType() {
    return {
      TRIP: 'Trip',
      TASK: 'Task',
    };
  }
}

export default Trail;
