/**
 * 应用管理相关的API接口
 * 包含应用的增删改查、部署、聊天生成代码等功能
 * 所有接口都通过统一的request实例进行HTTP请求
 */

// @ts-ignore
/* eslint-disable */
import request from '@/request'

/**
 * 添加新应用
 * @param body 应用添加请求参数，包含应用的基本信息
 * @param options 可选的请求配置选项
 * @returns 返回包含新创建应用ID的响应
 */
export async function addApp(body: API.AppAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/app/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/**
 * 管理员删除应用（管理员权限）
 * @param body 删除请求参数，包含要删除的应用ID
 * @param options 可选的请求配置选项
 * @returns 返回删除操作是否成功的布尔值
 */
export async function deleteAppByAdmin(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/app/admin/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/**
 * 管理员根据ID获取应用详情（管理员权限）
 * @param params 查询参数，包含应用ID
 * @param options 可选的请求配置选项
 * @returns 返回应用的详细信息
 */
export async function getAppVoByIdAdmin(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAppVOByIdAdminParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseAppVO>('/app/admin/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/**
 * 管理员分页查询应用列表（管理员权限）
 * @param body 分页查询请求参数，包含分页信息和查询条件
 * @param options 可选的请求配置选项
 * @returns 返回分页的应用列表数据
 */
export async function listAppVoByPageByAdmin(
  body: API.AppQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageAppVO>('/app/admin/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/**
 * 管理员更新应用信息（管理员权限）
 * @param body 应用更新请求参数，包含要更新的应用信息
 * @param options 可选的请求配置选项
 * @returns 返回更新操作是否成功的布尔值
 */
export async function updateAppByAdmin(
  body: API.AppAdminUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/app/admin/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/**
 * 聊天生成代码接口
 * 通过用户输入的消息生成相应的代码
 * @param params 查询参数，包含应用ID和用户消息
 * @param options 可选的请求配置选项
 * @returns 返回Server-Sent Events格式的代码生成流
 */
export async function chatToGenCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.chatToGenCodeParams,
  options?: { [key: string]: any }
) {
  return request<API.ServerSentEventString[]>('/app/chat/gen/code', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/**
 * 删除应用（普通用户权限）
 * @param body 删除请求参数，包含要删除的应用ID
 * @param options 可选的请求配置选项
 * @returns 返回删除操作是否成功的布尔值
 */
export async function deleteApp(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/app/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/**
 * 部署应用
 * 将生成的应用代码部署到线上环境
 * @param body 部署请求参数，包含要部署的应用ID
 * @param options 可选的请求配置选项
 * @returns 返回部署后的访问URL
 */
export async function deployApp(body: API.AppDeployRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseString>('/app/deploy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/**
 * 根据ID获取应用详情（普通用户权限）
 * @param params 查询参数，包含应用ID
 * @param options 可选的请求配置选项
 * @returns 返回应用的详细信息
 */
export async function getAppVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAppVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseAppVO>('/app/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/**
 * 获取应用信息（兼容性接口）
 * @param params 查询参数，包含应用ID
 * @param options 可选的请求配置选项
 * @returns 返回应用的基本信息
 */
export async function getInfo1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInfo1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.App>(`/app/getInfo/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/**
 * 分页查询优质应用列表
 * 获取被标记为优质的应用，通常用于首页展示
 * @param body 分页查询请求参数，包含分页信息和查询条件
 * @param options 可选的请求配置选项
 * @returns 返回分页的优质应用列表数据
 */
export async function listGoodAppVoByPage(
  body: API.AppQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageAppVO>('/app/good/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/**
 * 分页查询我的应用列表
 * 获取当前登录用户创建的所有应用
 * @param body 分页查询请求参数，包含分页信息和查询条件
 * @param options 可选的请求配置选项
 * @returns 返回分页的我的应用列表数据
 */
export async function listMyAppVoByPage(
  body: API.AppQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageAppVO>('/app/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/**
 * 分页查询应用列表（通用接口）
 * @param params 分页查询参数，包含页码、页大小等
 * @param options 可选的请求配置选项
 * @returns 返回分页的应用列表数据
 */
export async function page1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page1Params,
  options?: { [key: string]: any }
) {
  return request<API.PageApp>('/app/page', {
    method: 'GET',
    params: {
      ...params,
      page: undefined,
      ...params['page'],
    },
    ...(options || {}),
  })
}

/**
 * 更新应用信息（普通用户权限）
 * @param body 应用更新请求参数，包含要更新的应用信息
 * @param options 可选的请求配置选项
 * @returns 返回更新操作是否成功的布尔值
 */
export async function updateApp(body: API.AppUpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/app/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
