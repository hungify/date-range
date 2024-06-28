<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getMonthDays, isDateInRange, isToday } from '../utils/date'
import { DEFAULT_DAYS, DEFAULT_MONTHS } from '#/constants/date'
import type { DateType } from '#/types/date'

interface SelectedDate {
  start: string
  end: string
}

const monthRefs = ref<HTMLElement[]>([])
const selectedDate = ref<SelectedDate>({ start: '', end: '' })
const hoveredDate = ref<string>()
const currentYear = ref(new Date().getFullYear())

const checkIsToday = (date: Date) => isToday(date)

function checkIsSelected(date: Date) {
  return isDateInRange(
    date,
    new Date(selectedDate.value.start),
    new Date(selectedDate.value.end),
  )
}

function isHovered(date: Date) {
  const { start, end } = selectedDate.value
  const dateTime = date.getTime()
  const startDate = new Date(start)
  const startTime = startDate.getTime()

  if (!hoveredDate.value || (start && end))
    return false

  if (startTime > dateTime) {
    return isDateInRange(date, new Date(hoveredDate.value), startDate)
  }
  else {
    return isDateInRange(date, startDate, new Date(hoveredDate.value))
  }
}

function checkIsEndDate(date: Date) {
  return date.toISOString() === selectedDate.value.end
}

function checkIsStartDate(date: Date) {
  return date.toISOString() === selectedDate.value.start
}

function onClick(date: DateType['monthDay'], month: number) {
  if (date) {
    const { end, start } = selectedDate.value
    const newDate = new Date(currentYear.value, month, date)
    const newTime = newDate.getTime()

    const startDate = new Date(start)
    const startTime = startDate.getTime()

    if (!start || (start && end)) {
      selectedDate.value = { start: newDate.toISOString(), end: '' }
    }
    else if (startTime > newTime) {
      selectedDate.value = { start: newDate.toISOString(), end: start }
    }
    else {
      selectedDate.value = { start, end: newDate.toISOString() }
    }
  }
}

function onMouseEnter(date: DateType['monthDay'], month: number) {
  const { start, end } = selectedDate.value

  if (date && (!start || !end)) {
    hoveredDate.value = new Date(currentYear.value, month, date).toISOString()
  }
}

function onMouseLeave() {
  hoveredDate.value = undefined
}

onMounted(() => {
  const currentMonth = new Date().getMonth()
  if (monthRefs.value) {
    const currentMonthRef = monthRefs.value[currentMonth]
    currentMonthRef.scrollIntoView({ behavior: 'smooth' })
  }
})
</script>

<template>
  <div class="calendar">
    <header class="weekdays">
      <p v-for="day in DEFAULT_DAYS" :key="day.key">
        {{ day.title }}
      </p>
    </header>

    <div
      v-for="month in DEFAULT_MONTHS"
      :key="month.key"
      ref="monthRefs"
      class="month"
    >
      <h2>
        {{ month.title }} <span>{{ currentYear }}</span>
      </h2>
      <section class="monthdays">
        <div
          v-for="date in getMonthDays(month.key + 1, currentYear)"
          :key="date"
          class="date"
          :class="[
            {
              today: date && checkIsToday(new Date(currentYear, month.key, date)),
              selected: date && checkIsSelected(new Date(currentYear, month.key, date)),
              hovered: date && isHovered(new Date(currentYear, month.key, date)),
              start: date && checkIsStartDate(new Date(currentYear, month.key, date)),
              end: date && checkIsEndDate(new Date(currentYear, month.key, date)),
            },
          ]"
          @click="onClick(date, month.key)"
          @mouseenter="onMouseEnter(date, month.key)"
          @mouseleave="onMouseLeave"
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
      display: inline-block;
      border-radius: 50%;
      text-align: center;
      font-weight: 300;
      width: var(--size-6);
      height: var(--size-6);
      line-height: var(--size-6);

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    &.today {
      span {
        background: var(--red-4);
        color: var(--surface-1);
      }
    }

    &.selected,
    &.hovered {
      background: var(--surface-3) !important;
    }

    &.start {
      background: var(--blue-6) !important;
    }

    &.end {
      background: var(--blue-6) !important;
    }

    &.start,
    &.end {
      span {
        background: var(--blue-10);
        color: var(--surface-6);
      }
    }
  }
}
</style>
