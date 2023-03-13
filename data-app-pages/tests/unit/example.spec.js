import { shallowMount } from '@vue/test-utils'
import PagesData from '../../src/components/PagesData.vue'
import CardComponent from '../../src/components/CardComponent.vue'
import DeletePopup from '../../src/components/DeletePopup.vue'

describe('PagesData', () => {
  test('displays a list of items', async () => {
    const wrapper = shallowMount(PagesData)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAllComponents(CardComponent)).toHaveLength(10)
  })

  test('searches and filters items', async () => {
    const wrapper = shallowMount(PagesData)
    await wrapper.vm.$nextTick()

    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('John Doe')

    expect(wrapper.vm.filteredItems).toHaveLength(1)
  })

  test('deletes an item', async () => {
    const wrapper = shallowMount(PagesData)
    await wrapper.vm.$nextTick()

    const deleteButton = wrapper.find('.delete-button')
    await deleteButton.trigger('click')

    expect(wrapper.vm.deletePop).toBe(true)

    const deletePopup = wrapper.findComponent(DeletePopup)
    const deleteConfirmedEvent = jest.fn()
    wrapper.vm.$once('delete-confirmed', deleteConfirmedEvent)
    await deletePopup.vm.$emit('delete-confirmed')

    expect(deleteConfirmedEvent).toHaveBeenCalled()
    expect(wrapper.vm.deletePop).toBe(false)
    expect(wrapper.vm.items).not.toContainEqual({ _id: deleteId })
  })
})
