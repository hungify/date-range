<script lang="ts" setup>
import { DateType } from "#/types/date";
import { DEFAULT_MONTHS, DEFAULT_DAYS } from "#/constants/date";
import { getMonthDays, isToday, isSameDay } from "../utils/date"


const monthRefs = ref<HTMLElement[]>([])
const selectedDays = ref<string[]>([])
const currentYear = ref(new Date().getFullYear())
const isPressed = ref(false)


const checkIsToday = (date: Date) => isToday(date)

const checkIsSelected = (date: Date) => {
  return selectedDays.value.some((selectedDate) => isSameDay(new Date(selectedDate), date))
}

const onMouseDown = (date: DateType['monthDay'], month: number) => {
 isPressed.value = true
  if(date) {
    selectedDays.value = [new Date(currentYear.value, month, date).toISOString()]
  }
}

const onMouseEnter = (date: DateType['monthDay'], month: number) => {
  if(isPressed.value && date) {
    const newDate = new Date(currentYear.value, month, date)
    const newDateISOString = newDate.toISOString()
    if(selectedDays.value.includes(newDateISOString)) {
      selectedDays.value = selectedDays.value.filter((selectedDate) => selectedDate !== newDateISOString)
    } else {
      selectedDays.value = [...selectedDays.value, newDateISOString]
    }
  }
}

const onMouseUp = () => {
  isPressed.value = false
}




onMounted(() => {
  const currentMonth = new Date().getMonth()
  if(monthRefs.value) {
    const currentMonthRef = monthRefs.value[currentMonth]
    currentMonthRef.scrollIntoView({ behavior: 'smooth' })
  }
})

</script>

<template>
  <div class="calendar" ref="calendarRef">
    <header class="weekdays">
      <p v-for="day in DEFAULT_DAYS" :key="day.value">
        {{ day.title }}
      </p>
    </header>
    <div v-for="month in DEFAULT_MONTHS" :key="month.value" class="month" ref="monthRefs">
      <h2>{{ month.title }} <span>{{ currentYear }}</span></h2>
      <section class="monthdays">
        <div
          v-for="date in getMonthDays(month.value + 1, currentYear)"
          :key="date"
          :class="['date' ,{
            'today': date && checkIsToday(new Date(currentYear, month.value, date)),
            'selected': date && checkIsSelected(new Date(currentYear, month.value, date))
          }]"
          :draggable="false"
          @mousedown="onMouseDown(date, month.value)"
          @mouseenter="onMouseEnter(date, month.value)"
          @mouseup="onMouseUp"
        >
          <span v-if="date">
            {{ date }}
          </span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'https://unpkg.com/open-props';
@import 'https://unpkg.com/open-props/normalize.min.css';

.calendar {
  display: grid;

  block-size: 100dvb;
  overflow-y: auto;
  scroll-snap-type: y mandatory;

   .weekdays {
    position: sticky;
    inset-block-start: 0;
    background: var(--surface-1);

    display: grid;
    grid-template-columns: repeat(7, 1fr);
    place-items: end;

    padding-block-start: var(--size-9);
    border-block-end: 1px solid var(--surface-3);

    > p {
      padding: var(--size-2);
      color: var(--text-2);
    }
  }

   .month {
    scroll-snap-align: start;

    > h2 {
      padding: var(--size-3);
      padding-block-end: calc(var(--size-9) - var(--size-5));
      position: sticky;
      top: 0;
      z-index: 1;
      background: var(--surface-document);

      > span {
        font-weight: 200;
      }
    }

    > .monthdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);

      gap: 1px;
      background: var(--surface-2);
      border-block: 1px solid var(--surface-2);

      > div {
        aspect-ratio: var(--ratio-square);
        background: var(--surface-1);
      }
    }
  }

  .date {
    user-select: none;
    padding: var(--size-2);
    text-align: center;
    span {
      font-weight: 300;
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
     &.today {
      span {
        padding: var(--size-1);
        background: var(--red-4);
        color: var(--surface-1);
        border-radius: 50%;
      }
    }
    &.selected {
      background: var(--surface-3) !important;
      border: 1px solid var(--indigo-5);
    }
  }
}
</style>
