import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const config = await prisma.projectConfig.findUnique({
      where: {
        projectId: id,
      },
    })

    if (!config) {
      return NextResponse.json(
        { error: 'Configuração não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao buscar configuração:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { hourlyRate, workDays } = body

    // Verificar se o projeto existe
    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    // Criar configuração
    const config = await prisma.projectConfig.create({
      data: {
        projectId: id,
        hourlyRate,
        workDays,
      },
    })

    return NextResponse.json(config, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar configuração:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { hourlyRate, workDays } = body

    // Verificar se a configuração existe
    const existingConfig = await prisma.projectConfig.findUnique({
      where: { projectId: id },
    })

    if (!existingConfig) {
      return NextResponse.json(
        { error: 'Configuração não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar configuração
    const config = await prisma.projectConfig.update({
      where: { projectId: id },
      data: {
        hourlyRate,
        workDays,
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.projectConfig.delete({
      where: { projectId: id },
    })

    return NextResponse.json({ message: 'Configuração deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar configuração:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 