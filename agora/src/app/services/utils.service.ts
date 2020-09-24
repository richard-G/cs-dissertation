import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  // helper functions that are used across the app
  constructor() { }

  // returns a profile name formatted as "prefix. first last"
  formatName(profile: any) {
    const name = `${profile.first_name} ${profile.last_name}`;
    if (profile.prefix) {
      return `${profile.prefix} ${name}`;
    } else {
      return `${name}`;
    }
  }

  // converts an ISO timestamp into a date of format "DDD DDth MMM, YYYY"
  formatDate(timestamp: string) {
    const date = timestamp.split('T')[0];
    const ymd = date.split('-');

    const weekday = new Date(date).toLocaleDateString('en-GB', { weekday: 'short' });
    const day = Number(ymd[2]);
    let suffix: string;
    if (10 < day && day < 20) {
      suffix = 'th';
    } else {
      switch (day % 10) {
        case 1:
          suffix = 'st';
          break;
        case 2:
          suffix = 'nd';
          break;
        case 3:
          suffix = 'rd';
          break;
        default:
          suffix = 'th';
      }
    }
    const month = new Date(date).toLocaleDateString('en-GB', { month: 'short' });
    const year = ymd[0];
    return `${weekday} ${day}${suffix} ${month}, ${year}`;
  }

  // extracts and formats the time from a timestamp into (HH:MM)am/pm [12h]
  formatTime(timestamp: string) {
    const rawTime = timestamp.split('T')[1];
    const hhmmss = rawTime.split(':');
    let hour = Number(hhmmss[0]);
    const minute = Number(hhmmss[1]);

    const suffix = hour > 12 ? 'pm' : 'am';
    hour = hour > 12 ? hour - 12 : hour;

    const minuteStr = minute >= 10 ? minute : '0' + minute;

    const time = `${hour}:${minuteStr}${suffix}`;

    return time;
  }

  // takes as input a list of user objects, and returns them sorted by last_name, first_name
  sortNames(users: any) {
    const sortedUsers = users.sort((a, b) => {
      const compareLastName = a.last_name.localeCompare(b.last_name);
      const compareFirstName = a.first_name.localeCompare(b.first_name);

      // attempts to sort on last name, else sort based on first name
      return compareLastName || compareFirstName;
    });

    return sortedUsers;
  }
}
