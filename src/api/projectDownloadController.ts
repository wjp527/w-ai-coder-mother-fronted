// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 GET /project/download/${param0} */
export async function downloadProject(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.downloadProjectParams,
  options?: { [key: string]: any }
) {
  const { appId: param0, ...queryParams } = params
  return request<string>(`/project/download/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}
