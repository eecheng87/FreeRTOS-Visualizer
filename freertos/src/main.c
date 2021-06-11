#include <stdio.h>
#include <stdlib.h>

#include "FreeRTOS.h"
#include "task.h"
#include "queue.h"

static void vTask1( void *pvParameters );
static void vTask2( void *pvParameters );
static void T1( void *pvParameters );
static void T2( void *pvParameters );
static void T3( void *pvParameters );
static void T4( void *pvParameters );
static void Monitor(void *pvParameters);
int main()
{
//    static xQueueHandle xTestQueue;
//    xTestQueue = xQueueCreate( 10, ( unsigned portBASE_TYPE ) sizeof( unsigned short ) );
//    xTaskCreate( vTask1, "vTask1", configMINIMAL_STACK_SIZE, ( void * ) &xTestQueue, tskIDLE_PRIORITY, NULL );
//    xTaskCreate( vTask2, "vTask2", configMINIMAL_STACK_SIZE, ( void * ) &xTestQueue, tskIDLE_PRIORITY, NULL );

	xTaskCreate(T1, "T1", configMINIMAL_STACK_SIZE, NULL, 1, NULL);
	xTaskCreate(T2, "T2", configMINIMAL_STACK_SIZE, NULL, 1, NULL);
	xTaskCreate(T3, "T3", configMINIMAL_STACK_SIZE, NULL, 1, NULL);
	xTaskCreate(T4, "T4", configMINIMAL_STACK_SIZE, NULL, 1, NULL);
	xTaskCreate(Monitor, "Monitor", configMINIMAL_STACK_SIZE, NULL, 3, NULL);
    vTaskStartScheduler();
    return 1;
}
static void Monitor(void *pvParameters){
	while(1){
		TaskMonitor();
		vTaskDelay(500);
	}
}
static void T1( void *pvParameters ){
        while(1){
                printf("In T1...\n");
                vTaskDelay(300);
        }
}static void T2( void *pvParameters ){
        while(1){
                printf("In T2...\n");
                vTaskDelay(600);
        }
}static void T3( void *pvParameters ){
        while(1){
                printf("In T3...\n");
                vTaskDelay(800);
        }
}
static void T4( void *pvParameters ){
	while(1){
		printf("In T4...\n");
		vTaskDelay(500);
	}
}








static void vTask1( void *pvParameters )
{
unsigned short usValue = 0, usLoop;
xQueueHandle *pxQueue;
const unsigned short usNumToProduce = 3;
short sError = pdFALSE;

    pxQueue = ( xQueueHandle * ) pvParameters;

    for( ;; )
    {       
        for( usLoop = 0; usLoop < usNumToProduce; ++usLoop )
        {
            /* Send an incrementing number on the queue without blocking. */
            printf("Task1 will send: %d\r\n", usValue);
            if( xQueueSendToBack( *pxQueue, ( void * ) &usValue, ( portTickType ) 0 ) != pdPASS )
            {
                sError = pdTRUE;
            }
            else
            {
                ++usValue;
            }
        }
        vTaskDelay( 2000 );
    }
}
static void vTask2( void *pvParameters )
{
unsigned short usData = 0;
xQueueHandle *pxQueue;

    pxQueue = ( xQueueHandle * ) pvParameters;

    for( ;; )
    {       
        while( uxQueueMessagesWaiting( *pxQueue ) )
        {
            if( xQueueReceive( *pxQueue, &usData, ( portTickType ) 0 ) == pdPASS )
            {
                printf("Task2 received:%d\r\n", usData);
            }
        }
        vTaskDelay( 5000 );
    }
}

/********************************************************/
/* This is a stub function for FreeRTOS_Kernel */
void vMainQueueSendPassed( void )
{
    return;
}

/* This is a stub function for FreeRTOS_Kernel */
void vApplicationIdleHook( void )
{
    return;
}
