<script lang="ts" setup>
import { useQueryClient } from '@tanstack/vue-query'
import { useListComments, useListFormHistory, useListReviewFlows } from '~/client/api'

const props = defineProps({
  formId: {
    required: true,
    type: String,
  },
})
const queryClient = useQueryClient()
const { data: formHistory } = useListFormHistory({ formId: props.formId as string }, undefined, queryClient)
const { data: flow } = useListReviewFlows({ formId: props.formId })
</script>

<template>
  <Accordion v-if="formHistory && formHistory.data.length > 0" type="single" collapsible default-value="item-1">
    <!-- {{ flow }} -->
    <AccordionItem value="item-1">
      <AccordionTrigger class="py-0">
        История изменений
      </AccordionTrigger>
      <AccordionContent>
        <Table class="mt-2">
          <TableHeader>
            <TableRow>
              <TableHead class="w-[160px]">
                Дата/время
              </TableHead>
              <TableHead>Пользователь</TableHead>
              <TableHead>Комментарий</TableHead>
              <TableHead class="text-right">
                Статус
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <FormsHistoryRow v-for="row in formHistory.data" :key="row.id" :row="row" />

            <!-- <TableRow>
              <TableCell class="font-medium">
                <p class="font-normal text-[14px] leading-[24px] text-[#020617]">
                  {{ flow.data[0].createdAt }}
                </p>
              </TableCell>
              <TableCell />
              <TableCell>Заявка заполнена и отправлена на рассмотрение</TableCell>
              <TableCell class="text-right">
                <Badge class="bg-secondary text-foreground">
                  На рассмотрении
                </Badge>

              </TableCell>
            </TableRow> -->
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
  <div v-else>
    Заявка находится в статусе черновика и требует заполнения. История отсутствует.
  </div>
</template>
