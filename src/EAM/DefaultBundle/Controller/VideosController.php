<?php

namespace EAM\DefaultBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use EAM\DefaultBundle\Entity\Video;
use EAM\DefaultBundle\Form\Type\VideoType;
use EAM\DefaultBundle\Uploader\ImageUploader;

/**
 * @Route("/admin/videos")
 */
class VideosController extends Controller
{
    /**
     * @Route("/")
     * @Method({"GET"})
     * @Template
     */
    public function allAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        if (null === $videos = $em->getRepository('EAMDefaultBundle:Video')->findAll()) {
            $videos = array();
        }

        return array(
            'videos' => $videos
        );
    }

    /**
     * @Route("/ajouter")
     * @Method({"GET"})
     * @Template
     */
    public function addVideoAction(Request $request)
    {
        $video = new Video();
        $form = $this->createForm(new VideoType(), $video, array(
            'action' => $this->generateUrl('eam_default_videos_dovideo'),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        return [
            'form' => $form->createView(),
        ];
    }

    /**
     * @Route("/add-video")
     * @Method({"POST"})
     * @Template("EAMDefaultBundle:Galleries:addVideo.html.twig")
     */
    public function doVideoAction(Request $request)
    {
        $video = new Video();
        $form = $this->createForm(new VideoType(), $video, array(
            'action' => $this->generateUrl('eam_default_videos_dovideo'),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        $success = false;
        $form->handleRequest($request);
        if ($form->isValid()) {
            $name = $video->getImage()->getClientOriginalName();

            $uploader = new ImageUploader($this->container);
            $uploader->upload($video->getImage());

            $video->setImage($uploader->getUploadDir().'/'.$name);

            $em = $this->getDoctrine()->getManager();
            $em->persist($video);
            $em->flush();

            $success = true;
        }

        if ($success) {
            return $this->redirect($this->generateUrl('eam_default_videos_all'));
        }

        return array(
            'form' => $form->createView(),
            'success' => $success
        );
    }

    /**
     * @Route("/edit-video-{id}", requirements={
     *            "id"="\d+"
     *        })
     * @Method({"GET"})
     * @Template("EAMDefaultBundle:Galleries:addVideo.html.twig")
     */
    public function editVideoAction(Request $request, $id)
    {
        $repository = $this->getDoctrine()->getManager()->getRepository('EAMDefaultBundle:Video');
        $video = $repository->find($id);

        if ($video === null) {
            throw $this->createNotFoundException('Video[id='.$id.'] inexistant.');
        }

        $form = $this->createForm(new VideoType(), $video, array(
            'action' => $this->generateUrl('eam_default_videos_doeditvideo', ['id' => $video->getId() ]),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        return array(
            'form' => $form->createView()
        );

    }

    /**
     * @Route("/edit-video-{id}", requirements={
     *            "id"="\d+"
     *        })
     * @Method({"POST"})
     * @Template("EAMDefaultBundle:Galleries:addVideo.html.twig")
     */
    public function doEditVideoAction(Request $request, $id)
    {
        $repository = $this->getDoctrine()->getManager()->getRepository('EAMDefaultBundle:Video');
        $video = $repository->find($id);

        if ($video === null) {
            throw $this->createNotFoundException('Video[id='.$id.'] inexistant.');
        }

        $form = $this->createForm(new VideoType(), $video, array(
            'action' => $this->generateUrl('eam_default_videos_doeditvideo', [ 'id' => $video->getId() ]),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        $form->handleRequest($request);

        if ($form->isValid()) {
            $name = $video->getImage()->getClientOriginalName();

            $uploader = new ImageUploader($this->container);
            $uploader->upload($video->getImage());

            $video->setImage($uploader->getUploadDir().'/'.$name);

            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }

        return array(
            'form' => $form->createView()
        );
    }

    /**
     * @Route(path="/delete-video-{id}", requirements={
     *      "id"="\d+"
     * })
     * @Template
     * @Method({"GET"})
     */
    public function deleteVideoAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('EAMDefaultBundle:Video');
        $video = $repository->find($id);

        if ($video === null) {
            throw $this->createNotFoundException('Video[id='.$id.'] inexistant.');
        }
        $this->get('session')->getFlashBag()->add('info', 'video bien supprimé');

        $em->remove($video);
        $em->flush();

        return $this->redirect( $this->generateUrl('eam_default_videos_all') );
    }
}
